const PatientProfile = require('../models/PatientProfile');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const DoctorReview = require('../models/DoctorReview');

/**
 * @desc    Get patient health profile
 * @route   GET /api/patients/profile
 * @access  Private (Patient only)
 */
const getProfile = async (req, res, next) => {
  try {
    let profile = await PatientProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await PatientProfile.create({ userId: req.user._id });
    }

    const user = await User.findById(req.user._id);

    return res.status(200).json({
      success: true,
      profile,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        gender: user.gender,
        dateOfBirth: user.dateOfBirth,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update patient health profile & personal details
 * @route   PUT /api/patients/profile
 * @access  Private (Patient only)
 */
const updateProfile = async (req, res, next) => {
  try {
    const {
      // Personal info
      name,
      phone,
      gender,
      dateOfBirth,
      // Health metrics
      height,
      weight,
      bloodPressure,
      heartRate,
      glucose,
      allergies,
      conditions,
      medications,
      emergencyContact,
    } = req.body;

    // Update User model fields if provided
    const userUpdates = {};
    if (name) userUpdates.name = name;
    if (phone !== undefined) userUpdates.phone = phone;
    if (gender !== undefined) userUpdates.gender = gender;
    if (dateOfBirth !== undefined) userUpdates.dateOfBirth = dateOfBirth;

    if (Object.keys(userUpdates).length > 0) {
      await User.findByIdAndUpdate(req.user._id, userUpdates);
    }

    // Format allergies, conditions, medications arrays if strings passed
    const sanitizeArray = (val) => {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string' && val.trim()) {
        return val.split(',').map((s) => s.trim()).filter(Boolean);
      }
      return [];
    };

    let profile = await PatientProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new PatientProfile({ userId: req.user._id });
    }

    if (height !== undefined) profile.height = Number(height) || 0;
    if (weight !== undefined) profile.weight = Number(weight) || 0;
    if (bloodPressure !== undefined) profile.bloodPressure = bloodPressure;
    if (heartRate !== undefined) profile.heartRate = Number(heartRate) || 0;
    if (glucose !== undefined) profile.glucose = Number(glucose) || 0;
    if (allergies !== undefined) profile.allergies = sanitizeArray(allergies);
    if (conditions !== undefined) profile.conditions = sanitizeArray(conditions);
    if (medications !== undefined) profile.medications = sanitizeArray(medications);
    if (emergencyContact !== undefined) profile.emergencyContact = emergencyContact;

    await profile.save();

    const updatedUser = await User.findById(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Health profile updated successfully.',
      profile,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        gender: updatedUser.gender,
        dateOfBirth: updatedUser.dateOfBirth,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all assessments submitted by logged in patient
 * @route   GET /api/patients/assessments
 * @access  Private (Patient only)
 */
const getAssessments = async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ patientId: req.user._id })
      .sort({ createdAt: -1 })
      .lean();

    // Attach review details if available
    const populated = await Promise.all(
      assessments.map(async (item) => {
        const review = await DoctorReview.findOne({ assessmentId: item._id })
          .populate('doctorId', 'name email')
          .lean();
        return {
          ...item,
          review: review || null,
        };
      })
    );

    return res.status(200).json({
      success: true,
      assessments: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all appointments for logged in patient
 * @route   GET /api/patients/appointments
 * @access  Private (Patient only)
 */
const getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate('doctorId', 'name email')
      .sort({ date: 1, time: 1 })
      .lean();

    return res.status(200).json({
      success: true,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all medical records for logged in patient
 * @route   GET /api/patients/records
 * @access  Private (Patient only)
 */
const getRecords = async (req, res, next) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.user._id })
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      records,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getAssessments,
  getAppointments,
  getRecords,
};
