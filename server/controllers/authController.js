const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PatientProfile = require('../models/PatientProfile');
const DoctorProfile = require('../models/DoctorProfile');
const Notification = require('../models/Notification');

// Helper to sign JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'healthguard_super_secure_jwt_secret_key_2026_production', {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register new user (Patient or Doctor)
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      phone,
      dateOfBirth,
      gender,
      // Doctor-specific fields
      specialization,
      licenseNumber,
      hospital,
      experience,
      bio,
    } = req.body;

    // Validate required baseline fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required.',
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    const assignedRole = role === 'doctor' ? 'doctor' : 'patient';

    // Doctor specific validation
    if (assignedRole === 'doctor') {
      if (!specialization || !licenseNumber || !hospital) {
        return res.status(400).json({
          success: false,
          message: 'Medical specialization, license number, and hospital/clinic name are required for doctor registration.',
        });
      }
    }

    // Check if user email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists. Please log in.',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: assignedRole,
      phone: phone || '',
      dateOfBirth: dateOfBirth || null,
      gender: gender || '',
    });

    let profile = null;

    // Create corresponding role profile
    if (assignedRole === 'patient') {
      profile = await PatientProfile.create({
        userId: user._id,
      });

      await Notification.create({
        userId: user._id,
        message: 'Welcome to HealthGuard AI! Please complete your health profile to get started.',
        type: 'system',
        link: '/patient/profile',
      });
    } else {
      profile = await DoctorProfile.create({
        userId: user._id,
        specialization,
        licenseNumber,
        hospital,
        experience: experience ? Number(experience) : 0,
        bio: bio || '',
      });

      await Notification.create({
        userId: user._id,
        message: 'Welcome to HealthGuard AI Clinical Portal. Your professional credentials have been recorded.',
        type: 'system',
        link: '/doctor/dashboard',
      });
    }

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        createdAt: user.createdAt,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user & get JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    let profile = null;
    if (user.role === 'patient') {
      profile = await PatientProfile.findOne({ userId: user._id });
      if (!profile) {
        profile = await PatientProfile.create({ userId: user._id });
      }
    } else {
      profile = await DoctorProfile.findOne({ userId: user._id });
      if (!profile) {
        profile = await DoctorProfile.create({
          userId: user._id,
          specialization: 'General Practice',
          licenseNumber: 'MD-PENDING',
          hospital: 'Medical Center',
        });
      }
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully.',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        createdAt: user.createdAt,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in user & profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    let profile = null;
    if (user.role === 'patient') {
      profile = await PatientProfile.findOne({ userId: user._id });
    } else {
      profile = await DoctorProfile.findOne({ userId: user._id });
    }

    return res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
        createdAt: user.createdAt,
      },
      profile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Forgot password handler (simulated secure recovery workflow)
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address.',
      });
    }

    // Always return safe neutral response to prevent email enumeration
    return res.status(200).json({
      success: true,
      message: 'If an account with that email exists, a password reset link has been dispatched to your inbox.',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  forgotPassword,
};
