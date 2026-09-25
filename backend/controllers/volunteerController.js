import Match from '../models/Match.js';
import User from '../models/User.js';
import Donation from '../models/Donation.js';
import { sendDeliveredCertificateEmail } from '../utils/emailService.js';

/**
 * @desc   Get available rescue jobs for Volunteer Portal (filtered by all, near_me, urgent)
 * @route  GET /api/volunteers/jobs
 * @access Public / Volunteer
 */
export const getAvailableJobs = async (req, res, next) => {
  try {
    const { filter } = req.query; // 'all', 'near_me', 'urgent'
    let query = {
      status: { $in: ['accepted', 'volunteer_assigned', 'offered', 're_dispatch_needed', 'relay_needed'] },
    };

    if (filter === 'urgent') {
      query.isUrgent = true;
    }

    let matches = await Match.find(query)
      .populate('donation')
      .populate('donor', 'name phone location')
      .populate('shelter', 'name phone location')
      .sort({ updatedAt: -1 });

    if (filter === 'near_me') {
      matches = matches.filter((m) => (m.distanceKm || 0) <= 3.0);
    }

    const jobs = matches.map((m) => {
      const don = m.donation || {};
      let diffMs = don.expiresAt ? new Date(don.expiresAt) - new Date() : 2.5 * 60 * 60 * 1000;
      if (diffMs <= 0) {
        // Dynamic fallback for active demo jobs so they don't show 0.0 hours remaining
        diffMs = Math.max(1.2 * 60 * 60 * 1000, ((don.expiryHours || 3) * 60 * 60 * 1000) * 0.7);
      }
      const hoursRemaining = Math.max(0.5, (diffMs / (1000 * 60 * 60))).toFixed(1);

      const isRelay = m.status === 'relay_needed';
      const isRedispatch = m.status === 're_dispatch_needed';

      return {
        _id: m._id,
        jobCode: m.jobCode,
        donationId: don._id,
        pickupLocation: {
          name: m.pickupLocation?.name || don.donorName || 'Bistro 42',
          address: m.pickupLocation?.address || '123, Green Park, Sector 12, New Delhi',
          lat: m.pickupLocation?.lat || 28.5582,
          lng: m.pickupLocation?.lng || 77.2023,
          distanceKm: isRelay ? 0.8 : 1.2,
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
        isUrgent: m.isUrgent || hoursRemaining < 2 || isRelay || isRedispatch,
        isClaimed: m.status === 'volunteer_assigned',
        isRelay,
        isRedispatch,
        breakdownIncident: m.breakdownIncident || null,
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
    const isDemo = req.query.demo === 'true';
    let match = null;

    if (req.user) {
      match = await Match.findOne({
        volunteer: req.user._id,
        status: { $in: ['volunteer_assigned', 'in_transit', 'relay_needed', 're_dispatch_needed'] },
      }).populate('donation');
    } else if (req.query.volunteerId) {
      match = await Match.findOne({
        volunteer: req.query.volunteerId,
        status: { $in: ['volunteer_assigned', 'in_transit', 'relay_needed', 're_dispatch_needed'] },
      }).populate('donation');
    }

    if (!match && isDemo) {
      match = await Match.findOne({ jobCode: 'JOB-104' }).populate('donation');
      if (!match) match = await Match.findOne().populate('donation');
    }

    if (!match) {
      return res.json({
        success: true,
        activeJob: null,
        message: 'No active rescue mission currently claimed.',
      });
    }

    const don = match?.donation || {};
    let diffMs = don.expiresAt ? new Date(don.expiresAt) - new Date() : 2.5 * 60 * 60 * 1000;
    if (diffMs <= 0) {
      diffMs = Math.max(1.2 * 60 * 60 * 1000, ((don.expiryHours || 3) * 60 * 60 * 1000) * 0.7);
    }
    const hoursRemaining = Math.max(0.5, (diffMs / (1000 * 60 * 60))).toFixed(1);

    res.json({
      success: true,
      activeJob: {
        _id: match?._id,
        jobCode: match?.jobCode || 'JOB-DISPATCH',
        isUrgent: match?.isUrgent || hoursRemaining < 2,
        pickup: {
          name: match?.pickupLocation?.name || 'Bistro 42',
          address: match?.pickupLocation?.address || '123, Green Park, Sector 12, New Delhi',
          distance: '1.2 km away',
          lat: match?.pickupLocation?.lat || 28.5582,
          lng: match?.pickupLocation?.lng || 77.2023,
        },
        dropoff: {
          name: match?.dropoffLocation?.name || 'Hope Shelter',
          address: match?.dropoffLocation?.address || 'Community Hall 4, Lajpat Nagar, New Delhi',
          distance: '2.5 km away',
          lat: match?.dropoffLocation?.lat || 28.5677,
          lng: match?.dropoffLocation?.lng || 77.2433,
        },
        food: {
          weight: `${don.quantityKg || 15} kg`,
          category: don.category || 'Cooked Food',
          name: don.foodName || 'Cooked Meals',
          hoursRemaining: `${hoursRemaining} hours remaining`,
        },
        routeCoordinates: [
          { lat: match?.pickupLocation?.lat || 28.5582, lng: match?.pickupLocation?.lng || 77.2023, label: `Pickup: ${match?.pickupLocation?.name || 'Donor'}` },
          { lat: 28.562, lng: 77.221, label: 'Waypoint: Ring Road' },
          { lat: match?.dropoffLocation?.lat || 28.5677, lng: match?.dropoffLocation?.lng || 77.2433, label: `Dropoff: ${match?.dropoffLocation?.name || 'Shelter'}` },
        ],
        status: match?.status || 'volunteer_assigned',
        breakdownIncident: match?.breakdownIncident || null,
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

    const volunteer = req.user || (await User.findOne({ role: 'volunteer' })) || (await User.findOne());
    match.volunteer = volunteer._id;

    // If this was an emergency relay where food was already picked up, courier resumes transit
    if (match.status === 'relay_needed') {
      match.status = 'in_transit';
    } else {
      match.status = 'volunteer_assigned';
    }

    await match.save();

    if (match.donation) {
      match.donation.status = match.status;
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
 * @desc   Report rider vehicle malfunction and trigger emergency re-dispatch or relay
 * @route  POST /api/volunteers/report-breakdown
 * @access Public / Volunteer
 */
export const reportVehicleBreakdown = async (req, res, next) => {
  try {
    const { matchId, jobCode, reason, stage, breakdownLocation, notes } = req.body;

    let match = null;
    if (matchId) {
      match = await Match.findById(matchId).populate('donation');
    }
    if (!match && jobCode) {
      match = await Match.findOne({ jobCode }).populate('donation');
    }
    if (!match) {
      // Demo fallback match
      match = await Match.findOne({ status: { $in: ['volunteer_assigned', 'in_transit', 'accepted'] } }).populate('donation');
    }

    if (!match) {
      return res.status(404).json({ success: false, message: 'Active rescue job not found' });
    }

    const isMidTransit = stage === 'in_transit' || match.status === 'in_transit';

    match.breakdownIncident = {
      reported: true,
      stage: isMidTransit ? 'in_transit' : 'before_pickup',
      reason: reason || 'Vehicle Malfunction (Mechanical / Battery)',
      reportedAt: new Date(),
      location: breakdownLocation || {
        lat: 28.5620,
        lng: 77.2210,
        address: 'Midpoint Breakdown: Outer Ring Road Near AIIMS, New Delhi',
      },
      notes: notes || 'Rider reported breakdown. Emergency re-dispatch initiated.',
      originalVolunteerName: req.user?.name || 'Courier Volunteer',
    };

    match.isUrgent = true;

    if (isMidTransit) {
      // Courier already has the food in custody! Needs emergency relay handover.
      match.status = 'relay_needed';
      // Set pickup location to where the stranded courier is waiting
      if (breakdownLocation?.address) {
        match.pickupLocation = {
          name: 'Relay Point (Stranded Courier)',
          address: breakdownLocation.address,
          lat: breakdownLocation.lat || 28.5620,
          lng: breakdownLocation.lng || 77.2210,
        };
      }
      if (match.donation) {
        match.donation.status = 'relay_needed';
        match.donation.notes = `Emergency Relay: Food is with stranded courier at ${breakdownLocation?.address || 'Midway'}. Reason: ${reason}`;
        await match.donation.save();
      }
    } else {
      // Courier broke down before picking up food! Re-dispatch to food donor directly.
      match.status = 're_dispatch_needed';
      match.volunteer = null;
      if (match.donation) {
        match.donation.status = 're_dispatch_needed';
        match.donation.assignedVolunteer = null;
        match.donation.notes = `Courier breakdown before pickup (${reason}). Re-dispatching to nearest backup courier.`;
        await match.donation.save();
      }
    }

    await match.save();

    res.json({
      success: true,
      stage: isMidTransit ? 'in_transit' : 'before_pickup',
      message: isMidTransit
        ? 'Vehicle breakdown reported. Emergency Relay Dispatch activated: nearby couriers notified for handover.'
        : 'Vehicle breakdown reported. Job re-opened for immediate re-dispatch to backup couriers.',
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
    const volunteerId = match.volunteer || req.user?._id;
    if (volunteerId) {
      const volunteer = await User.findById(volunteerId);
      if (volunteer) {
        volunteer.volunteerDetails = volunteer.volunteerDetails || {};
        volunteer.volunteerDetails.completedRescuesCount = (volunteer.volunteerDetails.completedRescuesCount || 0) + 1;
        volunteer.volunteerDetails.totalKgDelivered = (volunteer.volunteerDetails.totalKgDelivered || 0) + (match.donation?.quantityKg || 10);
        volunteer.volunteerDetails.communitiesServed = Math.max(1, (volunteer.volunteerDetails.communitiesServed || 0) + 1);
        await volunteer.save();
      }
    }

    // Automatically email Section 80G Tax & ESG Certificate to donor via Brevo
    if (match.donation) {
      sendDeliveredCertificateEmail(match.donation).catch((err) =>
        console.warn('[Email] Non-blocking certificate delivery error:', err.message)
      );
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
 * @desc   Get volunteer stats (returns real user stats or onboarding zero-state)
 * @route  GET /api/volunteers/stats
 * @access Public / Volunteer
 */
export const getVolunteerStats = async (req, res, next) => {
  try {
    let volunteer = null;
    if (req.user && req.user.role === 'volunteer') {
      volunteer = req.user;
    } else if (req.query.volunteerId) {
      volunteer = await User.findById(req.query.volunteerId);
    } else if (req.query.demo === 'true') {
      volunteer = await User.findOne({ role: 'volunteer' });
    }

    const hasUserSession = Boolean(req.user);

    res.json({
      success: true,
      stats: {
        completedRescuesCount: volunteer?.volunteerDetails?.completedRescuesCount ?? (hasUserSession ? 0 : 12),
        totalKgDelivered: volunteer?.volunteerDetails?.totalKgDelivered ?? (hasUserSession ? 0 : 186),
        communitiesServed: volunteer?.volunteerDetails?.communitiesServed ?? (hasUserSession ? 0 : 8),
        certificatesEarned: volunteer?.volunteerDetails?.certificatesEarned ?? (hasUserSession ? 0 : 3),
        vehicleType: volunteer?.volunteerDetails?.vehicleType || 'Two-Wheeler / Scooter',
        isNewUser: hasUserSession && !(volunteer?.volunteerDetails?.completedRescuesCount > 0),
      },
    });
  } catch (error) {
    next(error);
  }
};
