const router = require('express').Router();
const { protect, adminOnly, optionalAuth } = require('../middlewares/auth.middleware');
const { validateCreateBooking } = require('../validators/booking.validator');
const {
  getBookings, createBooking, updateBookingStatus, deleteBooking
} = require('../controllers/booking.controller');

// GET — admin sees all, authenticated user sees own
router.get('/', protect, getBookings);

// POST — authenticated user creates booking
router.post('/', protect, validateCreateBooking, createBooking);

// PUT status — admin only
router.put('/:id/status', protect, adminOnly, updateBookingStatus);

// DELETE — admin only
router.delete('/:id', protect, adminOnly, deleteBooking);

module.exports = router;
