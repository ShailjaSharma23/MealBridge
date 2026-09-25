import express from 'express';
import {
  getAvailableJobs,
  getActiveRescueJob,
  claimRescueJob,
  completeDelivery,
  getVolunteerStats,
  reportVehicleBreakdown,
} from '../controllers/volunteerController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(optionalProtect);

router.get('/jobs', getAvailableJobs);
router.get('/active-job', getActiveRescueJob);
router.post('/jobs/:id/claim', claimRescueJob);
router.post('/jobs/:id/complete', completeDelivery);
router.post('/report-breakdown', reportVehicleBreakdown);
router.get('/stats', getVolunteerStats);

export default router;
