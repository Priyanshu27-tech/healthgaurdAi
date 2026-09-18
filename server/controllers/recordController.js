const MedicalRecord = require('../models/MedicalRecord');
const Notification = require('../models/Notification');
const User = require('../models/User');

/**
 * @desc    Upload / create medical record metadata
 * @route   POST /api/records
 * @access  Private (Patient or Doctor)
 */
const createRecord = async (req, res, next) => {
  try {
    const { title, type, fileUrl, description, patientId, recordDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Record title is required.',
      });
    }

    const assignedPatientId = req.user.role === 'patient' ? req.user._id : patientId;
    if (!assignedPatientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required for medical record storage.',
      });
    }

    const record = await MedicalRecord.create({
      patientId: assignedPatientId,
      uploadedBy: req.user._id,
      title,
      type: type || 'Lab Report',
      fileUrl: fileUrl || '',
      description: description || '',
      recordDate: recordDate ? new Date(recordDate) : new Date(),
    });

    const populated = await MedicalRecord.findById(record._id).populate('uploadedBy', 'name role');

    // Notify patient if uploaded by doctor
    if (req.user.role === 'doctor' && assignedPatientId.toString() !== req.user._id.toString()) {
      await Notification.create({
        userId: assignedPatientId,
        message: `Dr. ${req.user.name} uploaded a new medical document: "${title}".`,
        type: 'record',
        link: '/patient/records',
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Medical document recorded successfully.',
      record: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all medical records for a specific patient
 * @route   GET /api/records/:patientId
 * @access  Private (Patient owner or Doctor)
 */
const getRecordsByPatient = async (req, res, next) => {
  try {
    const { patientId } = req.params;

    // RBAC: If patient, they can only request their own records
    if (req.user.role === 'patient' && req.user._id.toString() !== patientId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: You can only view your own medical records.',
      });
    }

    const records = await MedicalRecord.find({ patientId })
      .populate('uploadedBy', 'name role')
      .sort({ recordDate: -1, createdAt: -1 })
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
  createRecord,
  getRecordsByPatient,
};
