// src/routes/bookings.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { requireAuth } = require('../middleware/auth');

router.post('/book', requireAuth, bookingController.createBooking);
router.get('/my', requireAuth, bookingController.getMyBookings);
router.delete('/:id', requireAuth, bookingController.cancelBooking);
router.get('/:id', bookingController.getBooking);
router.patch('/:id', requireAuth, bookingController.respondToBookingByDoctor);

module.exports = router;
