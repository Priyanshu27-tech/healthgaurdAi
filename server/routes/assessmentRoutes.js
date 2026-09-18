const express = require('express');
const router = express.Router();
const { createAssessment, getAssessmentById } = require('../controllers/assessmentController');
const { authenticateUser } = require('../middleware/auth');
const { authorizeRole } = require('../middleware/rbac');

router.post('/', authenticateUser, authorizeRole('patient'), createAssessment);
router.get('/:id', authenticateUser, getAssessmentById);

module.exports = router;
