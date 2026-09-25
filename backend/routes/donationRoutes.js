import express from 'express';
import {
  createDonation,
  getAllDonations,
  getActiveDonorDonation,
  getDonationCertificate,
} from '../controllers/donationController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(optionalProtect);

router.post('/', createDonation);
router.get('/', getAllDonations);
router.get('/active-pipeline', getActiveDonorDonation);
router.get('/certificate/:id', getDonationCertificate);

export default router;
