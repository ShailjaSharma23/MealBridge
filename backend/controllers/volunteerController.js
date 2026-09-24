import Match from '../models/Match.js';
import User from '../models/User.js';
import Donation from '../models/Donation.js';

/**
 * @desc   Get available rescue jobs for Volunteer Portal (filtered by all, near_me, urgent)
 * @route  GET /api/volunteers/jobs
 * @access Public / Volunteer
 */
export const getAvailableJobs = async (req, res, next) => {
  try {
    const { filter } = req.query; // 'all', 'near_me', 'urgent'
    let query = {
      status: { $in: ['accepted', 'volunteer_assigned', 'offered'] },
    };

    if (filter === 'urgent') {
      query.isUrgent = true;
    }

    let matches = await Match.find(query)
      .populate('donation')
      .populate('donor', 'name phone location')
      .populate('shelter', 'name phone location');

    if (filter === 'near_me') {
      matches = matches.filter((m) => (m.distanceKm || 0) <= 3.0);
    }

    const jobs = matches.map((m) => {
      const don = m.donation || {};
      const diffMs = don.expiresAt ? new Date(don.expiresAt) - new Date() : 2 * 60 * 60 * 1000;
      const hoursRemaining = Math.max(0, (diffMs / (1000 * 60 * 60)).toFixed(1));

      return {
        _id: m._id,
        jobCode: m.jobCode,
        donationId: don._id,
        pickupLocation: {
          name: m.pickupLocation?.name || don.donorName || 'Bistro 42',
          address: m.pickupLocation?.address || '123, Green Park, Sector 12, New Delhi',
          lat: m.pickupLocation?.lat || 28.5582,
          lng: m.pickupLocation?.lng || 77.2023,
          distanceKm: 1.2,
        },
        dropoffLocation: {
          name: m.dropoffLocation?.name || 'Hope Shelter',
          address: m.dropoffLocation?.address || 'Community Hall 4, Lajpat Nagar, New Delhi',
          lat: m.dropoffLocation?.lat || 28.5677,
          lng: m.dropoffLocation?.lng || 77.2433,
          distanceKm: 2.5,
        },
        foodDetails: {
          name: don.foodName || '15kg Cooked Food',
          category: don.category || 'Cooked Food',
          quantityKg: don.quantityKg || 15,
          hoursRemaining: `${hoursRemaining} hours remaining`,
        },
        status: m.status,
        isUrgent: m.isUrgent || hoursRemaining < 2,
        isClaimed: m.status === 'volunteer_assigned',
      };
    });

    res.json({
      success: true,
      filter: filter || 'all',
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get active rescue job details (matches UI Rescue Job #104)
 * @route  GET /api/volunteers/active-job
 * @access Public / Volunteer
 */
export const getActiveRescueJob = async (req, res, next) => {
  try {
    let match = await Match.findOne({ jobCode: 'JOB-104' }).populate('donation');
    if (!match) {
      match = await Match.findOne().populate('donation');
    }

    const don = match?.donation || {};

    res.json({
      success: true,
      activeJob: {
        _id: match?._id,
        jobCode: match?.jobCode || 'JOB-104',
        isUrgent: true,
        pickup: {
          name: match?.pickupLocation?.name || 'Bistro 42',
          address: match?.pickupLocation?.address || '123, Green Park, Sector 12, New Delhi',
          distance: '1.2 km away',
          lat: 28.5582,
          lng: 77.2023,
        },
        dropoff: {
          name: match?.dropoffLocation?.name || 'Hope Shelter',
          address: match?.dropoffLocation?.address || 'Community Hall 4, Lajpat Nagar, New Delhi',
          distance: '2.5 km away',
          lat: 28.5677,
          lng: 77.2433,
        },
        food: {
          weight: `${don.quantityKg || 15} kg`,
          category: 'Cooked Food',
          name: don.foodName || 'Cooked Meals',
          hoursRemaining: '2.5 hours remaining',
        },
        routeCoordinates: [
          { lat: 28.5582, lng: 77.2023, label: 'Pickup: Bistro 42' },
          { lat: 28.562, lng: 77.221, label: 'Waypoint: Ring Road' },
          { lat: 28.5677, lng: 77.2433, label: 'Dropoff: Hope Shelter' },
        ],
        status: match?.status || 'volunteer_assigned',
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Claim a rescue job
 * @route  POST /api/volunteers/jobs/:id/claim
 * @access Public / Volunteer
 */
export const claimRescueJob = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id).populate('donation');
    if (!match) {
      return res.status(404).json({ success: false, message: 'Rescue job not found' });
    }

    const volunteer = (await User.findOne({ role: 'volunteer' })) || (await User.findOne());
    match.volunteer = volunteer._id;
    match.status = 'volunteer_assigned';
    await match.save();

    if (match.donation) {
      match.donation.status = 'volunteer_assigned';
      match.donation.assignedVolunteer = volunteer._id;
      match.donation.trackingTimestamps.volunteerAssignedAt = new Date();
      await match.donation.save();
    }

    res.json({
      success: true,
      message: `Rescue job ${match.jobCode} claimed successfully! Navigation route active.`,
      match,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Complete a delivery
 * @route  POST /api/volunteers/jobs/:id/complete
 * @access Public / Volunteer
 */
export const completeDelivery = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id).populate('donation');
    if (!match) {
      return res.status(404).json({ success: false, message: 'Rescue job not found' });
    }

    match.status = 'delivered';
    await match.save();

    if (match.donation) {
      match.donation.status = 'delivered';
      match.donation.trackingTimestamps.deliveredAt = new Date();
      await match.donation.save();
    }

    // Update volunteer stats
    const volunteer = await User.findById(match.volunteer);
    if (volunteer && volunteer.volunteerDetails) {
      volunteer.volunteerDetails.completedRescuesCount += 1;
      volunteer.volunteerDetails.totalKgDelivered += match.donation?.quantityKg || 10;
      await volunteer.save();
    }

    res.json({
      success: true,
      message: 'Rescue mission completed and marked delivered! Thank you for feeding the community.',
      match,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Get volunteer stats (matching UI: 12 jobs, 186kg delivered, 8 communities, 3 certificates)
 * @route  GET /api/volunteers/stats
 * @access Public / Volunteer
 */
export const getVolunteerStats = async (req, res, next) => {
  try {
    const volunteer = (await User.findOne({ role: 'volunteer' })) || (await User.findOne());

    res.json({
      success: true,
      stats: {
        completedRescuesCount: volunteer?.volunteerDetails?.completedRescuesCount || 12,
        totalKgDelivered: volunteer?.volunteerDetails?.totalKgDelivered || 186,
        communitiesServed: volunteer?.volunteerDetails?.communitiesServed || 8,
        certificatesEarned: volunteer?.volunteerDetails?.certificatesEarned || 3,
        vehicleType: volunteer?.volunteerDetails?.vehicleType || 'Scooter / Mini Van',
      },
    });
  } catch (error) {
    next(error);
  }
};
