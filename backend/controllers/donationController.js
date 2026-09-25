import Donation from '../models/Donation.js';
import Match from '../models/Match.js';
import User from '../models/User.js';
import { sendDonationConfirmationEmail } from '../utils/emailService.js';

/**
 * @desc   Create new surplus food donation
 * @route  POST /api/donations
 * @access Public / Donor
 */
export const createDonation = async (req, res, next) => {
  try {
    const {
      foodName,
      category,
      quantityKg,
      expiryHours,
      pickupAddress,
      dietaryType,
      photoUrl,
      donorId,
    } = req.body;

    let donor = null;
    if (req.user) {
      donor = req.user;
    } else if (donorId) {
      donor = await User.findById(donorId);
    }
    if (!donor) {
      donor = (await User.findOne({ role: 'donor' })) || (await User.findOne());
    }
    if (!donor) {
      donor = await User.create({
        name: req.body.donorName || 'Bistro 42',
        email: 'bistro42@mealbridge.org',
        password: 'password123',
        role: 'donor',
        organizationType: 'Restaurant',
        location: {
          address: pickupAddress || '123, Green Park, Sector 12, New Delhi - 110016',
          coordinates: req.body.pickupCoordinates || { lat: 28.5582, lng: 77.2023 },
        },
      });
    }

    const expiryNum = parseFloat(expiryHours) || 3;
    const expiresAt = new Date(Date.now() + expiryNum * 60 * 60 * 1000);

    const donation = await Donation.create({
      donor: donor._id,
      donorName: donor.name,
      foodName: foodName || 'Fresh Cooked Meals',
      category: category || 'Cooked Meals',
      quantityKg: parseFloat(quantityKg) || 10,
      dietaryType: dietaryType || 'Veg Only',
      expiryHours: expiryNum,
      expiresAt,
      pickupAddress: pickupAddress || donor.location?.address || '123, Green Park, New Delhi',
      pickupCoordinates: req.body.pickupCoordinates || donor.location?.coordinates || { lat: 28.5582, lng: 77.2023 },
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop',
      status: 'matched',
    });

    // Auto-match with nearest compatible shelter (Hope Shelter as default demo match)
    let targetShelter = await User.findOne({ role: 'shelter' });
    if (!targetShelter) {
      targetShelter = await User.create({
        name: 'Hope Shelter NGO',
        email: 'hope.shelter@mealbridge.org',
        password: 'password123',
        role: 'shelter',
        location: {
          address: 'Community Hall 4, Lajpat Nagar, New Delhi',
          coordinates: { lat: 28.5677, lng: 77.2433 },
        },
      });
    }

    const match = await Match.create({
      jobCode: `JOB-${Math.floor(100 + Math.random() * 900)}`,
      donation: donation._id,
      donor: donor._id,
      shelter: targetShelter._id,
      status: 'offered',
      distanceKm: 1.8,
      isUrgent: expiryNum <= 1.5,
      pickupLocation: {
        name: donor.name,
        address: donation.pickupAddress,
        lat: donation.pickupCoordinates.lat,
        lng: donation.pickupCoordinates.lng,
      },
      dropoffLocation: {
        name: targetShelter.name,
        address: targetShelter.location?.address || 'Community Hall 4, Lajpat Nagar, New Delhi',
        lat: targetShelter.location?.coordinates?.lat || 28.5677,
        lng: targetShelter.location?.coordinates?.lng || 77.2433,
      },
      offerExpiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 mins cascade
    });

    donation.assignedShelter = targetShelter._id;
    donation.currentMatch = match._id;
    donation.trackingTimestamps = {
      postedAt: new Date(),
      matchedAt: new Date(),
      volunteerAssignedAt: null,
      pickedUpAt: null,
      deliveredAt: null,
    };
    await donation.save();

    // Trigger Brevo automated confirmation email to donor
    sendDonationConfirmationEmail(donation, donor?.email).catch((err) =>
      console.warn('[Email] Non-blocking dispatch notice:', err.message)
    );

    res.status(201).json({
      success: true,
      message: 'Donation created and matched with nearby shelter in real-time!',
      donation,
      match,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get all donations
 * @route  GET /api/donations
 * @access Public
 */
export const getAllDonations = async (req, res, next) => {
  try {
    const { status, category } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;

    const donations = await Donation.find(filter)
      .populate('donor', 'name email phone location')
      .populate('assignedShelter', 'name location shelterDetails')
      .populate('assignedVolunteer', 'name phone volunteerDetails')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: donations.length, donations });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get donor's active donation for progress tracker pipeline
 * @route  GET /api/donations/active-pipeline
 * @access Public / Donor
 */
export const getActiveDonorDonation = async (req, res, next) => {
  try {
    const isDemo = req.query.demo === 'true';
    let query = {
      status: { $in: ['posted', 'matched', 'volunteer_assigned', 'picked_up', 're_dispatch_needed', 'relay_needed'] },
    };

    if (req.user) {
      query.donor = req.user._id;
    } else if (req.query.donorId) {
      query.donor = req.query.donorId;
    } else if (!isDemo) {
      // Unauthenticated visitor / brand new donor with 0 donations - return clean empty state
      return res.json({
        success: true,
        donation: null,
        trackerSteps: [],
        isNewUser: true,
      });
    }

    let donation = await Donation.findOne(query)
      .populate('donor', 'name location')
      .populate('assignedShelter', 'name location')
      .populate('assignedVolunteer', 'name phone volunteerDetails')
      .populate('currentMatch')
      .sort({ updatedAt: -1 });

    if (!donation) {
      if (isDemo) {
        donation = await Donation.findOne().populate('assignedShelter');
      } else {
        return res.json({
          success: true,
          donation: null,
          trackerSteps: [],
          isNewUser: true,
        });
      }
    }

    const shelterName = donation?.assignedShelter?.name || 'Local Verified Shelter';
    const volunteerName = donation?.assignedVolunteer?.name || 'Nearby Community Volunteer';

    res.json({
      success: true,
      donation,
      trackerSteps: [
        {
          step: 1,
          title: 'Posted',
          description: 'Your surplus food donation has been logged into the dispatch network.',
          timestamp: donation?.trackingTimestamps?.postedAt
            ? new Date(donation.trackingTimestamps.postedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Just Now',
          status: 'completed',
        },
        {
          step: 2,
          title: `Matched with ${shelterName}`,
          description: `Direct match accepted by ${shelterName} based on capacity & dietary safety.`,
          timestamp: donation?.trackingTimestamps?.matchedAt
            ? new Date(donation.trackingTimestamps.matchedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Matched',
          status: donation?.status === 'matched' ? 'live' : 'completed',
        },
        {
          step: 3,
          title: 'Volunteer Assigned',
          description: donation?.assignedVolunteer
            ? `${volunteerName} is en route for pickup.`
            : 'Dispatching nearest available courier for contactless food pickup.',
          timestamp: donation?.trackingTimestamps?.volunteerAssignedAt
            ? new Date(donation.trackingTimestamps.volunteerAssignedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Pending Dispatch',
          status:
            donation?.status === 'volunteer_assigned' || donation?.status === 'picked_up'
              ? 'live'
              : donation?.status === 'delivered'
              ? 'completed'
              : 'pending',
        },
        {
          step: 4,
          title: 'Delivered',
          description: 'Safe handoff at shelter. Fresh meals distributed to community members.',
          timestamp: donation?.trackingTimestamps?.deliveredAt
            ? new Date(donation.trackingTimestamps.deliveredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            : 'Pending Handover',
          status: donation?.status === 'delivered' ? 'completed' : 'pending',
        },
      ],
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get Certificate data for ESG & Tax Deduction
 * @route  GET /api/donations/certificate/:id
 * @access Public
 */
export const getDonationCertificate = async (req, res, next) => {
  try {
    let donation = null;
    if (req.params.id && req.params.id !== 'latest') {
      donation = await Donation.findById(req.params.id).populate('donor').populate('assignedShelter');
    } else if (req.user) {
      donation = await Donation.findOne({ donor: req.user._id }).populate('donor').populate('assignedShelter').sort({ createdAt: -1 });
    }

    if (!donation) {
      donation = await Donation.findOne().populate('donor').populate('assignedShelter');
    }

    const donorDisplayName = req.user?.name || donation?.donorName || 'Registered Food Partner';

    res.json({
      success: true,
      certificate: {
        certificateNumber: `MB-ESG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        issueDate: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
        donorName: donorDisplayName,
        recipientShelter: donation?.assignedShelter?.name || 'Hope Shelter NGO',
        foodCategory: donation?.category || 'Cooked Meals',
        quantityRescuedKg: donation?.quantityKg || 15,
        approxMealsProvided: donation?.servingsCount || 38,
        co2DivertedKg: ((donation?.quantityKg || 15) * 2.5).toFixed(1),
        taxDeductionCategory: 'Eligible for 80G Tax Exemption (CSR / Charitable Food Relief)',
        verificationStatus: 'Verified by MealBridge Platform 🌉',
      },
    });
  } catch (error) {
    next(error);
  }
};
