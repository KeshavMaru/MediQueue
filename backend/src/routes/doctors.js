// src/routes/doctors.js
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/', doctorController.listDoctors);
router.get('/:id/slots', requireAuth, doctorController.getDoctorSlots);
router.get('/:id', doctorController.getDoctorById); // Public doctor details

// Protected admin routes
router.post('/', requireAuth, requireAdmin, doctorController.createDoctor);
// Allow authenticated users; controller will authorize admin or doctor-owner
router.post('/:id/generate-slots', requireAuth, doctorController.generateSlotsForDoctor);

// (routes defined above)

module.exports = router;

