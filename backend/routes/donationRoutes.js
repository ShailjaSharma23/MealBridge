import express from 'express';
import {
  createDonation,
  getAllDonations,
  getActiveDonorDonation,
  getDonationCertificate,
} from '../controllers/donationController.js';

const router = express.Router();

router.post('/', createDonation);
router.get('/', getAllDonations);
router.get('/active-pipeline', getActiveDonorDonation);
router.get('/certificate/:id', getDonationCertificate);

export default router;
