import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../utils/emailService.js';

// In-memory OTP Cache (email -> { otp, expiresAt })
const otpStore = new Map();

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

/**
 * @desc   Get logged in user profile (role-specific details)
 * @route  GET /api/users/profile
 * @access Private
 */
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Update user profile with role-specific form fields
 * @route  PUT /api/users/profile
 * @access Private
 */
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Common fields
    if (req.body.name) user.name = req.body.name;
    if (req.body.phone) user.phone = req.body.phone;
    if (req.body.address) {
      user.location = user.location || {};
      user.location.address = req.body.address;
    }
    if (req.body.coordinates) {
      user.location = user.location || {};
      user.location.coordinates = req.body.coordinates;
    }

    // Role-specific fields
    if (user.role === 'donor') {
      if (req.body.organizationType) user.organizationType = req.body.organizationType;
      if (req.body.fssaiLicense) user.fssaiLicense = req.body.fssaiLicense;
    } else if (user.role === 'shelter') {
      user.shelterDetails = user.shelterDetails || {};
      if (req.body.capacityKg !== undefined) user.shelterDetails.capacityKg = Number(req.body.capacityKg);
      if (req.body.currentStorageUsedKg !== undefined) user.shelterDetails.currentStorageUsedKg = Number(req.body.currentStorageUsedKg);
      if (req.body.foodPreferences) user.shelterDetails.foodPreferences = req.body.foodPreferences;
      if (req.body.contactPerson) user.shelterDetails.contactPerson = req.body.contactPerson;
    } else if (user.role === 'volunteer') {
      user.volunteerDetails = user.volunteerDetails || {};
      if (req.body.vehicleType) user.volunteerDetails.vehicleType = req.body.vehicleType;
      if (req.body.isAvailableNow !== undefined) user.volunteerDetails.isAvailableNow = Boolean(req.body.isAvailableNow);
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully!',
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Send 6-digit OTP verification code to user's email via Brevo
 * @route  POST /api/users/send-otp
 * @access Public
 */
export const sendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide an email address' });
    }

    // Generate secure 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

    otpStore.set(email.toLowerCase(), { otp, expiresAt });

    // Send email via Brevo non-blocking
    sendOtpEmail(email, otp).catch((err) =>
      console.warn('[OTP Email Error]:', err.message)
    );

    res.json({
      success: true,
      message: `OTP sent successfully to ${email}!`,
      demoHint: `Demo OTP: ${otp} (or use 123456 for instant bypass)`,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc   Verify 6-digit OTP and authenticate user
 * @route  POST /api/users/verify-otp
 * @access Public
 */
export const verifyOtp = async (req, res, next) => {
  try {
    const { email, otp, role, name } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP code are required' });
    }

    const emailKey = email.toLowerCase();
    const record = otpStore.get(emailKey);

    const isValid =
      otp === '123456' ||
      (record && record.otp === otp && Date.now() < record.expiresAt);

    if (!isValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP. Please check your email or use demo OTP 123456.',
      });
    }

    // OTP verified! Find or create user
    let user = await User.findOne({ email: emailKey });
    if (!user) {
      user = await User.create({
        name: name || emailKey.split('@')[0],
        email: emailKey,
        password: 'password123',
        role: role || 'donor',
      });
    }

    otpStore.delete(emailKey);
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'OTP verified successfully! Logged in.',
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
 * @desc   Authenticate or register user via Google Sign-In
 * @route  POST /api/users/google-login
 * @access Public
 */
export const googleLoginUser = async (req, res, next) => {
  try {
    const { email, name, role, avatar } = req.body;
    const targetEmail = (email || 'google.user@gmail.com').toLowerCase().trim();

    let user = await User.findOne({ email: targetEmail });
    if (!user) {
      const derivedName = name || targetEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      user = await User.create({
        name: derivedName,
        email: targetEmail,
        password: 'google_oauth_auth_password_2026',
        role: role || 'donor',
        organizationType: role === 'shelter' ? 'Shelter' : role === 'volunteer' ? 'Individual' : 'Restaurant',
        avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      message: `Successfully authenticated with Google as ${user.name}!`,
    });
  } catch (error) {
    next(error);
  }
};

