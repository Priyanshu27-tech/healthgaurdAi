const express = require('express');
const router = express.Router();
const { createRecord, getRecordsByPatient } = require('../controllers/recordController');
const { authenticateUser } = require('../middleware/auth');

router.use(authenticateUser);

router.post('/', createRecord);
router.get('/:patientId', getRecordsByPatient);

module.exports = router;
