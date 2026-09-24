import express from 'express';
import {
  getUsers,
  switchActiveRole,
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/switch-role', switchActiveRole);
router.post('/register', registerUser);
router.post('/login', loginUser);

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);

export default router;
