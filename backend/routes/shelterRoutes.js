import express from 'express';
import {
  getIncomingOffers,
  respondToOffer,
  getShelterCapacity,
  updateShelterCapacity,
} from '../controllers/shelterController.js';
import { optionalProtect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(optionalProtect);

router.get('/incoming-offers', getIncomingOffers);
router.post('/offers/:id/respond', respondToOffer);
router.get('/capacity', getShelterCapacity);
router.put('/capacity', updateShelterCapacity);

export default router;
