const Appointment = require('../models/Appointment');
const User = require('../models/User');
const Notification = require('../models/Notification');

/**
 * @desc    Book a new appointment
 * @route   POST /api/appointments
 * @access  Private (Patient or Doctor)
 */
const createAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, time, reason, notes } = req.body;

    if (!doctorId || !date || !time || !reason) {
      return res.status(400).json({
        success: false,
        message: 'Doctor, date, time, and consultation reason are required.',
      });
    }

    const doctor = await User.findOne({ _id: doctorId, role: 'doctor' });
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Selected doctor could not be found.',
      });
    }

    const patientId = req.user.role === 'patient' ? req.user._id : req.body.patientId;
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required.',
      });
    }

    const appointment = await Appointment.create({
      patientId,
      doctorId,
      date,
      time,
      reason,
      notes: notes || '',
      status: 'Scheduled',
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name email');

    // Notify doctor
    await Notification.create({
      userId: doctorId,
      message: `New appointment scheduled with ${req.user.name} for ${date} at ${time}.`,
      type: 'appointment',
      link: '/doctor/appointments',
    });

    // Notify patient
    await Notification.create({
      userId: patientId,
      message: `Your appointment with Dr. ${doctor.name} is confirmed for ${date} at ${time}.`,
      type: 'appointment',
      link: '/patient/appointments',
    });

    return res.status(201).json({
      success: true,
      message: 'Appointment booked successfully.',
      appointment: populatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get appointment by ID
 * @route   GET /api/appointments/:id
 * @access  Private
 */
const getAppointmentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name email');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    // RBAC ownership check
    const isOwnerPatient = appointment.patientId._id.toString() === req.user._id.toString();
    const isOwnerDoctor = appointment.doctorId._id.toString() === req.user._id.toString();

    if (!isOwnerPatient && !isOwnerDoctor) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to view this appointment.',
      });
    }

    return res.status(200).json({
      success: true,
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update appointment status or details
 * @route   PUT /api/appointments/:id
 * @access  Private
 */
const updateAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, notes, date, time, reason } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    if (status) appointment.status = status;
    if (notes !== undefined) appointment.notes = notes;
    if (date) appointment.date = date;
    if (time) appointment.time = time;
    if (reason) appointment.reason = reason;

    await appointment.save();

    const populated = await Appointment.findById(id)
      .populate('patientId', 'name email phone')
      .populate('doctorId', 'name email');

    // Notify patient of status update if modified by doctor
    if (status && req.user.role === 'doctor') {
      await Notification.create({
        userId: appointment.patientId,
        message: `Your appointment status has been updated to "${status}".`,
        type: 'appointment',
        link: '/patient/appointments',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Appointment updated successfully.',
      appointment: populated,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel appointment
 * @route   DELETE /api/appointments/:id
 * @access  Private
 */
const cancelAppointment = async (req, res, next) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findById(id);
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    appointment.status = 'Cancelled';
    await appointment.save();

    const otherPartyId =
      req.user._id.toString() === appointment.patientId.toString()
        ? appointment.doctorId
        : appointment.patientId;

    await Notification.create({
      userId: otherPartyId,
      message: `Appointment scheduled for ${appointment.date} at ${appointment.time} has been cancelled by ${req.user.name}.`,
      type: 'appointment',
      link: req.user.role === 'patient' ? '/doctor/appointments' : '/patient/appointments',
    });

    return res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully.',
      appointment,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all appointments for doctor
 * @route   GET /api/doctors/appointments
 * @access  Private (Doctor only)
 */
const getDoctorAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user._id })
      .populate('patientId', 'name email phone dateOfBirth gender')
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

module.exports = {
  createAppointment,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
  getDoctorAppointments,
};
