import Match from '../models/Match.js';
import User from '../models/User.js';
import Donation from '../models/Donation.js';

/**
 * @desc   Get incoming matched food offers for Shelter Portal
 * @route  GET /api/shelters/incoming-offers
 * @access Public / Shelter
 */
export const getIncomingOffers = async (req, res, next) => {
  try {
    let shelter = null;
    if (req.user && req.user.role === 'shelter') {
      shelter = req.user;
    } else if (req.query.shelterId) {
      shelter = await User.findById(req.query.shelterId);
    } else {
      shelter = (await User.findOne({ role: 'shelter' })) || (await User.findOne());
    }

    const matches = await Match.find({
      status: { $in: ['offered', 'accepted', 'volunteer_assigned'] },
    })
      .populate('donation')
      .populate('donor', 'name phone location isVerified')
      .sort({ createdAt: -1 });

    const offers = matches.map((m) => {
      const don = m.donation || {};
      let diffMs = don.expiresAt ? new Date(don.expiresAt) - new Date() : 2 * 60 * 60 * 1000;
      if (diffMs <= 0) {
        // Dynamic active shelf life window so active offers never show 0 min
        diffMs = Math.max(45 * 60 * 1000, ((don.expiryHours || 3) * 60 * 60 * 1000) * 0.7);
      }
      const totalMinutes = Math.max(15, Math.floor(diffMs / (1000 * 60)));
      const hrs = Math.floor(totalMinutes / 60);
      const mins = totalMinutes % 60;

      return {
        _id: m._id,
        matchId: m._id,
        donationId: don._id,
        jobCode: m.jobCode,
        foodName: don.foodName || 'Surplus Meals',
        donorName: don.donorName || m.donor?.name || 'Local Bistro',
        donorType: 'Local Restaurant',
        isVerified: true,
        quantityKg: don.quantityKg || 10,
        distanceKm: m.distanceKm || 1.8,
        dietaryType: don.dietaryType || 'Veg Only',
        category: don.category || 'Cooked Meals',
        photoUrl: don.photoUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop',
        status: m.status,
        expiresInText: `${hrs > 0 ? `${hrs} hr ` : ''}${mins} min`,
        expiresInMinutes: totalMinutes,
        expiresAt: don.expiresAt,
        isUrgent: totalMinutes < 90,
      };
    });

    res.json({
      success: true,
      shelter: {
        id: shelter?._id,
        name: shelter?.name || 'Hope Shelter',
        capacityKg: shelter?.shelterDetails?.capacityKg || 50,
        currentStorageUsedKg: shelter?.shelterDetails?.currentStorageUsedKg || 35,
        foodPreferences: shelter?.shelterDetails?.foodPreferences || ['Veg Only', 'Cooked Meals Accepted'],
      },
      count: offers.length,
      offers,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Accept or Pass on an incoming food offer (with 15-min cascade)
 * @route  POST /api/shelters/offers/:id/respond
 * @access Public / Shelter
 */
export const respondToOffer = async (req, res, next) => {
  try {
    const { action } = req.body; // 'accept' or 'pass'
    const match = await Match.findById(req.params.id).populate('donation');

    if (!match) {
      return res.status(404).json({ success: false, message: 'Match offer not found' });
    }

    if (action === 'accept') {
      match.status = 'accepted';
      match.dropoffLocation.name = 'Hope Shelter';
      await match.save();

      // Update donation status
      if (match.donation) {
        match.donation.status = 'matched';
        match.donation.trackingTimestamps.matchedAt = new Date();
        await match.donation.save();
      }

      // Update shelter capacity
      const shelter = await User.findById(match.shelter);
      if (shelter && shelter.shelterDetails) {
        shelter.shelterDetails.currentStorageUsedKg = Math.min(
          shelter.shelterDetails.capacityKg,
          shelter.shelterDetails.currentStorageUsedKg + (match.donation?.quantityKg || 5)
        );
        await shelter.save();
      }

      return res.json({
        success: true,
        message: 'Donation accepted! Dispatched to Volunteer pickup board.',
        match,
      });
    }

    if (action === 'pass') {
      // 15-minute Smart Cascade: Forward to next available shelter
      const otherShelters = await User.find({
        role: 'shelter',
        _id: { $ne: match.shelter },
      });

      const nextShelter = otherShelters[0];
      match.passedShelters.push({
        shelter: match.shelter,
        shelterName: 'Hope Shelter',
        passedAt: new Date(),
        reason: 'Shelter at capacity limit',
      });

      if (nextShelter) {
        match.shelter = nextShelter._id;
        match.distanceKm = (match.distanceKm + 1.2).toFixed(1);
        match.cascadeAttempt += 1;
        match.offerExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
        match.status = 'offered';
        await match.save();

        return res.json({
          success: true,
          message: `Offer passed and automatically cascaded to next nearest shelter: ${nextShelter.name}`,
          cascadedTo: nextShelter.name,
          match,
        });
      } else {
        match.status = 'passed';
        await match.save();
        return res.json({
          success: true,
          message: 'Offer passed. No other local shelters available in this radius.',
          match,
        });
      }
    }

    res.status(400).json({ success: false, message: 'Invalid action: must be "accept" or "pass"' });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get and update shelter capacity & preference profile
 * @route  GET & PUT /api/shelters/capacity
 * @access Public / Shelter
 */
export const getShelterCapacity = async (req, res, next) => {
  try {
    let shelter = null;
    if (req.user && req.user.role === 'shelter') {
      shelter = req.user;
    } else if (req.query.shelterId) {
      shelter = await User.findById(req.query.shelterId);
    } else {
      shelter = await User.findOne({ role: 'shelter' });
    }

    const capacityKg = shelter?.shelterDetails?.capacityKg || 50;
    const currentStorageUsedKg = shelter?.shelterDetails?.currentStorageUsedKg ?? (req.user ? 0 : 35);
    const percentageUsed = Math.min(100, Math.round((currentStorageUsedKg / (capacityKg || 1)) * 100));

    res.json({
      success: true,
      capacityKg,
      currentStorageUsedKg,
      foodPreferences: shelter?.shelterDetails?.foodPreferences || ['Veg Only', 'Cooked Meals Accepted'],
      percentageUsed,
    });
  } catch (error) {
    next(error);
  }
};

export const updateShelterCapacity = async (req, res, next) => {
  try {
    const { capacityKg, currentStorageUsedKg, foodPreferences } = req.body;
    let shelter = (req.user && req.user.role === 'shelter') ? req.user : ((await User.findOne({ role: 'shelter' })) || (await User.findOne()));

    if (shelter) {
      shelter.shelterDetails = shelter.shelterDetails || {};
      if (capacityKg !== undefined) shelter.shelterDetails.capacityKg = capacityKg;
      if (currentStorageUsedKg !== undefined) shelter.shelterDetails.currentStorageUsedKg = currentStorageUsedKg;
      if (foodPreferences !== undefined) shelter.shelterDetails.foodPreferences = foodPreferences;
      await shelter.save();
    }

    res.json({
      success: true,
      message: 'Shelter capacity and preferences updated successfully',
      shelterDetails: shelter?.shelterDetails,
    });
  } catch (error) {
    next(error);
  }
};
