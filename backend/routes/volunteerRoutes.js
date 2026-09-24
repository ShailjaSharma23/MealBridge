import express from 'express';
import {
  getAvailableJobs,
  getActiveRescueJob,
  claimRescueJob,
  completeDelivery,
  getVolunteerStats,
} from '../controllers/volunteerController.js';

const router = express.Router();

router.get('/jobs', getAvailableJobs);
router.get('/active-job', getActiveRescueJob);
router.post('/jobs/:id/claim', claimRescueJob);
router.post('/jobs/:id/complete', completeDelivery);
router.get('/stats', getVolunteerStats);

export default router;
