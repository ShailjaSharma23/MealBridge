import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'mealbridge_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};

/**
 * @desc   Get list of all users or filter by role
 * @route  GET /api/users
 * @access Public
 */
export const getUsers = async (req, res, next) => {
  try {
    const { role } = req.query;
    const filter = role ? { role } : {};
    const users = await User.find(filter).select('-password');
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Fast role switch for hackathon demos (Donor, Shelter, Volunteer, Guest)
 * @route  POST /api/users/switch-role
 * @access Public
 */
export const switchActiveRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['donor', 'shelter', 'volunteer', 'guest'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }

    // Pick demo user matching the role
    let user = await User.findOne({ role }).select('-password');
    if (!user) {
      user = await User.create({
        name: `Demo ${role.toUpperCase()}`,
        email: `${role}.demo@mealbridge.org`,
        password: 'password123',
        role,
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      role: user.role,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Register a new user
 * @route  POST /api/users/register
 * @access Public
 */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, organizationType, phone, address } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'donor',
      organizationType: organizationType || 'Restaurant',
      phone: phone || '+91 98765 43210',
      location: { address: address || 'New Delhi' },
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Login user
 * @route  POST /api/users/login
 * @access Public
 */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      res.json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};
