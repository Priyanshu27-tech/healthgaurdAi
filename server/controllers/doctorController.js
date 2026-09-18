const DoctorProfile = require('../models/DoctorProfile');
const PatientProfile = require('../models/PatientProfile');
const User = require('../models/User');
const Assessment = require('../models/Assessment');
const DoctorReview = require('../models/DoctorReview');
const Appointment = require('../models/Appointment');
const MedicalRecord = require('../models/MedicalRecord');
const Notification = require('../models/Notification');

/**
 * @desc    Get all registered verified doctors (for booking)
 * @route   GET /api/doctors
 * @access  Private (Authenticated users)
 */
const getDoctors = async (req, res, next) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('name email phone').lean();
    
    const populated = await Promise.all(
      doctors.map(async (doc) => {
        const profile = await DoctorProfile.findOne({ userId: doc._id }).lean();
        return {
          ...doc,
          profile: profile || {
            specialization: 'General Medicine',
            hospital: 'HealthGuard Medical Center',
            experience: 5,
            consultationHours: 'Mon - Fri: 09:00 AM - 05:00 PM',
          },
        };
      })
    );

    return res.status(200).json({
      success: true,
      doctors: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get doctor profile
 * @route   GET /api/doctors/profile
 * @access  Private (Doctor only)
 */
const getProfile = async (req, res, next) => {
  try {
    let profile = await DoctorProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = await DoctorProfile.create({
        userId: req.user._id,
        specialization: 'General Practice',
        licenseNumber: 'MD-PENDING',
        hospital: 'HealthGuard Medical Group',
      });
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
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update doctor profile
 * @route   PUT /api/doctors/profile
 * @access  Private (Doctor only)
 */
const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      specialization,
      hospital,
      experience,
      bio,
      consultationHours,
      profileImage,
    } = req.body;

    if (name || phone !== undefined) {
      const userUpdates = {};
      if (name) userUpdates.name = name;
      if (phone !== undefined) userUpdates.phone = phone;
      await User.findByIdAndUpdate(req.user._id, userUpdates);
    }

    let profile = await DoctorProfile.findOne({ userId: req.user._id });
    if (!profile) {
      profile = new DoctorProfile({ userId: req.user._id });
    }

    if (specialization) profile.specialization = specialization;
    if (hospital) profile.hospital = hospital;
    if (experience !== undefined) profile.experience = Number(experience) || 0;
    if (bio !== undefined) profile.bio = bio;
    if (consultationHours) profile.consultationHours = consultationHours;
    if (profileImage !== undefined) profile.profileImage = profileImage;

    await profile.save();

    const updatedUser = await User.findById(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Doctor profile updated successfully.',
      profile,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get patient roster with search and filter
 * @route   GET /api/doctors/patients
 * @access  Private (Doctor only)
 */
const getPatients = async (req, res, next) => {
  try {
    const { search, status } = req.query;

    let query = { role: 'patient' };
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const patients = await User.find(query).select('name email phone dateOfBirth gender createdAt').lean();

    const patientDetails = await Promise.all(
      patients.map(async (patient) => {
        const profile = await PatientProfile.findOne({ userId: patient._id }).lean();
        const latestAssessment = await Assessment.findOne({ patientId: patient._id })
          .sort({ createdAt: -1 })
          .lean();

        // Calculate age
        let age = null;
        if (patient.dateOfBirth) {
          const diff = Date.now() - new Date(patient.dateOfBirth).getTime();
          age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
        }

        // Determine review status
        let patientStatus = 'New';
        if (latestAssessment) {
          if (latestAssessment.status === 'pending') {
            patientStatus = 'Pending Review';
          } else if (latestAssessment.status === 'reviewed') {
            patientStatus = 'Reviewed';
          } else if (latestAssessment.status === 'requires_followup') {
            patientStatus = 'Follow-up Needed';
          }
        }

        return {
          ...patient,
          age,
          profile,
          latestAssessment,
          status: patientStatus,
        };
      })
    );

    // Apply status filter if provided
    let filtered = patientDetails;
    if (status && status !== 'all') {
      const normalized = status.toLowerCase().replace('-', '_');
      if (normalized === 'pending' || normalized === 'pending_review') {
        filtered = patientDetails.filter((p) => p.status === 'Pending Review');
      } else if (normalized === 'reviewed') {
        filtered = patientDetails.filter((p) => p.status === 'Reviewed');
      } else if (normalized === 'new') {
        filtered = patientDetails.filter((p) => p.status === 'New');
      }
    }

    return res.status(200).json({
      success: true,
      patients: filtered,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get complete medical chart for a specific patient
 * @route   GET /api/doctors/patients/:id
 * @access  Private (Doctor only)
 */
const getPatientById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const patient = await User.findOne({ _id: id, role: 'patient' }).select('-password').lean();
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient record not found.',
      });
    }

    const profile = await PatientProfile.findOne({ userId: id }).lean();
    const assessments = await Assessment.find({ patientId: id }).sort({ createdAt: -1 }).lean();
    const records = await MedicalRecord.find({ patientId: id }).sort({ createdAt: -1 }).lean();
    const appointments = await Appointment.find({ patientId: id }).sort({ date: -1 }).lean();

    // Calculate age
    let age = null;
    if (patient.dateOfBirth) {
      const diff = Date.now() - new Date(patient.dateOfBirth).getTime();
      age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }

    return res.status(200).json({
      success: true,
      patient: {
        ...patient,
        age,
      },
      profile,
      assessments,
      records,
      appointments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get assessments queue for doctors
 * @route   GET /api/doctors/assessments
 * @access  Private (Doctor only)
 */
const getAssessments = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const assessments = await Assessment.find(query)
      .populate('patientId', 'name email phone dateOfBirth gender')
      .sort({ createdAt: -1 })
      .lean();

    const populated = await Promise.all(
      assessments.map(async (ass) => {
        const review = await DoctorReview.findOne({ assessmentId: ass._id })
          .populate('doctorId', 'name email')
          .lean();
        return {
          ...ass,
          review,
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
 * @desc    Get single assessment for doctor review
 * @route   GET /api/doctors/assessments/:id
 * @access  Private (Doctor only)
 */
const getAssessmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const assessment = await Assessment.findById(id)
      .populate('patientId', 'name email phone dateOfBirth gender')
      .lean();

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Health assessment not found.',
      });
    }

    // Get patient profile & previous assessments
    const profile = await PatientProfile.findOne({ userId: assessment.patientId._id }).lean();
    const previousAssessments = await Assessment.find({
      patientId: assessment.patientId._id,
      _id: { $ne: assessment._id },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const review = await DoctorReview.findOne({ assessmentId: assessment._id })
      .populate('doctorId', 'name email')
      .lean();

    return res.status(200).json({
      success: true,
      assessment: {
        ...assessment,
        review,
      },
      patientProfile: profile,
      previousAssessments,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Doctor submits clinical review for an assessment
 * @route   POST /api/doctors/reviews
 * @access  Private (Doctor only)
 */
const submitReview = async (req, res, next) => {
  try {
    const { assessmentId, notes, status } = req.body;

    if (!assessmentId || !notes) {
      return res.status(400).json({
        success: false,
        message: 'Assessment ID and clinical review notes are required.',
      });
    }

    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment not found.',
      });
    }

    const reviewStatus = status === 'requires_followup' ? 'requires_followup' : 'reviewed';

    // Upsert DoctorReview
    let review = await DoctorReview.findOne({ assessmentId });
    if (review) {
      review.notes = notes;
      review.status = reviewStatus;
      review.doctorId = req.user._id;
      review.reviewedAt = Date.now();
      await review.save();
    } else {
      review = await DoctorReview.create({
        assessmentId,
        patientId: assessment.patientId,
        doctorId: req.user._id,
        notes,
        status: reviewStatus,
        reviewedAt: Date.now(),
      });
    }

    // Update assessment status
    assessment.status = reviewStatus;
    await assessment.save();

    // Create Notification for the Patient
    await Notification.create({
      userId: assessment.patientId,
      message: `Dr. ${req.user.name} has reviewed your recent health assessment. Click to view clinical notes.`,
      type: 'review',
      link: '/patient/assessments',
    });

    return res.status(200).json({
      success: true,
      message: 'Clinical review submitted successfully.',
      review,
      assessment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDoctors,
  getProfile,
  updateProfile,
  getPatients,
  getPatientById,
  getAssessments,
  getAssessmentById,
  submitReview,
};
