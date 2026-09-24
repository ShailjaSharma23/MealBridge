import express from 'express';
import { chatMealBot, calculateExpiryRisk } from '../controllers/aiController.js';

const router = express.Router();

router.post('/mealbot', chatMealBot);
router.post('/calculate-expiry', calculateExpiryRisk);

export default router;
