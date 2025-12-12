// src/index.js

const expiryWorker = require('./jobs/expiryWorker');

expiryWorker.startExpiryWorker();

require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const app = express();

// Routes
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctors');
const bookingRoutes = require('./routes/bookings');
const adminRoutes = require('./routes/admin');
const { requireAuth, requireAdmin } = require('./middleware/auth');

// Security middleware
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());

// Rate limiting for login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many login attempts, please try again later',
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// Auth routes (public)
app.use('/auth', authRoutes);
app.post('/auth/login', loginLimiter, (req, res, next) => {
  // loginLimiter will be applied separately in auth routes
  next();
});

// Public routes
app.use('/doctors', doctorRoutes);
app.use('/bookings', bookingRoutes);

// Protected admin routes
app.use('/admin/doctors', requireAuth, requireAdmin, doctorRoutes);
app.use('/admin', adminRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`MediQueue backend listening on ${PORT}`));

