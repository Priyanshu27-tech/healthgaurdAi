require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const PredictionService = require('./services/predictionService');
const seedData = require('./seed/seedData');
const User = require('./models/User');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const doctorRoutes = require('./routes/doctorRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const recordRoutes = require('./routes/recordRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

// Middleware
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', process.env.CLIENT_URL].filter(Boolean),
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logger for development
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.url}`);
    next();
  });
}

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'HealthGuard AI API Server',
    timestamp: new Date().toISOString(),
    database: 'Connected',
  });
});

// Live ML Prediction Microservice Status Check
app.get('/api/predictions/status', async (req, res) => {
  const status = await PredictionService.getServiceStatus();
  res.status(200).json({
    success: true,
    data: status,
  });
});

// Mount Application Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/notifications', notificationRoutes);

// 404 Route Catch-all
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API route not found: ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Check if initial seed is needed
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Server] Database is uninitialized. Running initial seed data...');
      await seedData();
    }

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`====================================================`);
      console.log(` HealthGuard AI Server is running on http://127.0.0.1:${PORT}`);
      console.log(` API Healthcheck: http://127.0.0.1:${PORT}/api/health`);
      console.log(` Future ML Status: http://127.0.0.1:${PORT}/api/predictions/status`);
      console.log(`====================================================`);
    });

    return server;
  } catch (err) {
    console.error('[Server] Fatal startup error:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
