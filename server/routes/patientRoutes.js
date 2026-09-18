const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getAssessments,
  getAppointments,
  getRecords,
} = require('../controllers/patientController');
const { authenticateUser } = require('../middleware/auth');
const { authorizeRole } = require('../middleware/rbac');

// All routes here require valid patient authentication
router.use(authenticateUser);
router.use(authorizeRole('patient'));

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/assessments', getAssessments);
router.get('/appointments', getAppointments);
router.get('/records', getRecords);

module.exports = router;
