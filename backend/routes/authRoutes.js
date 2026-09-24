import express from 'express';
import {
  getUsers,
  switchActiveRole,
  registerUser,
  loginUser,
} from '../controllers/authController.js';

const router = express.Router();

router.get('/', getUsers);
router.post('/switch-role', switchActiveRole);
router.post('/register', registerUser);
router.post('/login', loginUser);

export default router;
