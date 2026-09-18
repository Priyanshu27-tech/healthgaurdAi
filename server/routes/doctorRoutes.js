const express = require('express');
const router = express.Router();
const {
  getDoctors,
  getProfile,
  updateProfile,
  getPatients,
  getPatientById,
  getAssessments,
  getAssessmentById,
  submitReview,
} = require('../controllers/doctorController');
const { getDoctorAppointments } = require('../controllers/appointmentController');
const { authenticateUser } = require('../middleware/auth');
const { authorizeRole } = require('../middleware/rbac');

// Public listing of active doctors for patient appointment booking
router.get('/', authenticateUser, getDoctors);

// Doctor-only routes
router.get('/profile', authenticateUser, authorizeRole('doctor'), getProfile);
router.put('/profile', authenticateUser, authorizeRole('doctor'), updateProfile);
router.get('/patients', authenticateUser, authorizeRole('doctor'), getPatients);
router.get('/patients/:id', authenticateUser, authorizeRole('doctor'), getPatientById);
router.get('/assessments', authenticateUser, authorizeRole('doctor'), getAssessments);
router.get('/assessments/:id', authenticateUser, authorizeRole('doctor'), getAssessmentById);
router.post('/reviews', authenticateUser, authorizeRole('doctor'), submitReview);
router.get('/appointments', authenticateUser, authorizeRole('doctor'), getDoctorAppointments);

module.exports = router;
