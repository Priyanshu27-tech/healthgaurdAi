const express = require('express');
const router = express.Router();
const {
  createAppointment,
  getAppointmentById,
  updateAppointment,
  cancelAppointment,
} = require('../controllers/appointmentController');
const { authenticateUser } = require('../middleware/auth');

router.use(authenticateUser);

router.post('/', createAppointment);
router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);
router.delete('/:id', cancelAppointment);

module.exports = router;
