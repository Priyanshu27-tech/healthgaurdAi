const Assessment = require('../models/Assessment');
const PatientProfile = require('../models/PatientProfile');
const DoctorReview = require('../models/DoctorReview');
const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * @desc    Submit new health assessment (Patient)
 * @route   POST /api/assessments
 * @access  Private (Patient)
 */
const createAssessment = async (req, res, next) => {
  try {
    const { symptoms, vitals, lifestyle, medicalHistory } = req.body;

    // Build assessment document
    const newAssessment = await Assessment.create({
      patientId: req.user._id,
      symptoms: Array.isArray(symptoms) ? symptoms : [],
      vitals: vitals || {},
      lifestyle: lifestyle || {},
      medicalHistory: medicalHistory || {},
      status: 'pending',
      submittedAt: new Date(),
    });

    // Update patient profile with latest vitals snapshot if provided
    if (vitals) {
      const profileUpdates = {};
      if (vitals.height) profileUpdates.height = Number(vitals.height);
      if (vitals.weight) profileUpdates.weight = Number(vitals.weight);
      if (vitals.bloodPressure) profileUpdates.bloodPressure = vitals.bloodPressure;
      if (vitals.heartRate) profileUpdates.heartRate = Number(vitals.heartRate);

      if (Object.keys(profileUpdates).length > 0) {
        await PatientProfile.findOneAndUpdate(
          { userId: req.user._id },
          { $set: profileUpdates },
          { new: true, upsert: true }
        );
      }
    }

    // Create confirmation notification for the patient
    await Notification.create({
      userId: req.user._id,
      message: 'Your health assessment has been securely recorded and submitted for clinical review.',
      type: 'assessment',
      link: '/patient/assessments',
    });

    // Notify registered doctors that a new patient assessment is awaiting review
    const doctors = await User.find({ role: 'doctor' }).select('_id');
    for (const doc of doctors) {
      await Notification.create({
        userId: doc._id,
        message: `New health assessment submitted by ${req.user.name} is awaiting your clinical review.`,
        type: 'assessment',
        link: `/doctor/assessments/${newAssessment._id}`,
      });
    }

    /**
     * NOTE: Future ML prediction integration hook:
     * When external ML microservice is enabled, this is where predictionService
     * would be called asynchronously:
     * // PredictionService.requestRiskPrediction(newAssessment);
     * 
     * In this production version: Zero automated diagnosis or fake metrics.
     */

    return res.status(201).json({
      success: true,
      message: 'Assessment submitted successfully. Your information has been securely recorded and is available for doctor review.',
      assessmentId: newAssessment._id,
      assessment: newAssessment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get assessment by ID
 * @route   GET /api/assessments/:id
 * @access  Private (Patient owner or Doctor)
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
        message: 'Assessment record not found.',
      });
    }

    // Check ownership: must be the patient owner or a doctor
    if (
      req.user.role === 'patient' &&
      assessment.patientId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden: You do not have permission to view another patient’s assessment.',
      });
    }

    // Attach review if exists
    const review = await DoctorReview.findOne({ assessmentId: assessment._id })
      .populate('doctorId', 'name email')
      .lean();

    return res.status(200).json({
      success: true,
      assessment: {
        ...assessment,
        review: review || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAssessment,
  getAssessmentById,
};
