const express = require('express');
const router = express.Router();
const { getBookings, createBooking, updateBooking, cancelBooking, getMyBookings } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my', protect, getMyBookings);
router.get('/', protect, authorize('admin'), getBookings);
router.post('/', protect, createBooking);
router.put('/:id', protect, authorize('admin'), updateBooking);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
