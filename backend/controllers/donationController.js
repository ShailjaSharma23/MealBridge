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
    if (donorId) {
      donor = await User.findById(donorId);
    }
    if (!donor) {
      donor = (await User.findOne({ role: 'donor' })) || (await User.findOne());
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
      pickupCoordinates: donor.location?.coordinates || { lat: 28.5582, lng: 77.2023 },
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&auto=format&fit=crop',
      status: 'matched',
    });

    // Auto-match with nearest compatible shelter (Hope Shelter as default demo match)
    const targetShelter = (await User.findOne({ role: 'shelter' })) || donor;

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
    let donation = await Donation.findOne({
      status: { $in: ['posted', 'matched', 'volunteer_assigned', 'picked_up'] },
    })
      .populate('donor', 'name location')
      .populate('assignedShelter', 'name location')
      .populate('assignedVolunteer', 'name phone volunteerDetails')
      .populate('currentMatch')
      .sort({ updatedAt: -1 });

    if (!donation) {
      donation = await Donation.findOne().populate('assignedShelter');
    }

    res.json({
      success: true,
      donation,
      trackerSteps: [
        {
          step: 1,
          title: 'Posted',
          description: 'Your donation has been posted successfully.',
          timestamp: donation?.trackingTimestamps?.postedAt || 'Today, 2:34 PM',
          status: 'completed',
        },
        {
          step: 2,
          title: `Matched with ${donation?.assignedShelter?.name || 'Hope Shelter'}`,
          description: `Your food has been matched with ${donation?.assignedShelter?.name || 'Hope Shelter'} (2.4 km away).`,
          timestamp: donation?.trackingTimestamps?.matchedAt || 'Today, 2:37 PM',
          status: 'live',
        },
        {
          step: 3,
          title: 'Volunteer Assigned',
          description: donation?.assignedVolunteer?.name
            ? `${donation.assignedVolunteer.name} is on their way to pick up your donation.`
            : 'A volunteer is on their way to pick up your donation.',
          timestamp: donation?.trackingTimestamps?.volunteerAssignedAt,
          status: donation?.status === 'volunteer_assigned' || donation?.status === 'picked_up' || donation?.status === 'delivered' ? 'completed' : 'pending',
        },
        {
          step: 4,
          title: 'Delivered',
          description: 'Your food will soon reach the shelter and make a difference!',
          timestamp: donation?.trackingTimestamps?.deliveredAt,
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
    } else {
      donation = await Donation.findOne().populate('donor').populate('assignedShelter');
    }

    res.json({
      success: true,
      certificate: {
        certificateNumber: `MB-ESG-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        issueDate: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }),
        donorName: donation?.donorName || 'Bistro 42',
        recipientShelter: donation?.assignedShelter?.name || 'Hope Shelter',
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
