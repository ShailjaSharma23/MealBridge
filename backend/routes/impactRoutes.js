import express from 'express';
import { getImpactMetrics } from '../controllers/impactController.js';

const router = express.Router();

router.get('/', getImpactMetrics);

export default router;
