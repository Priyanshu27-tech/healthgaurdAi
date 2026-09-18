const express = require('express');
const router = express.Router();
const { register, login, getMe, forgotPassword } = require('../controllers/authController');
const { authenticateUser } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateUser, getMe);
router.post('/forgot-password', forgotPassword);

module.exports = router;
