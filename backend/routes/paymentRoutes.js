const express = require('express');
const router = express.Router();
const { getPayments, createPayment, updatePayment, getMyPayments } = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my', protect, getMyPayments);
router.get('/', protect, authorize('admin'), getPayments);
router.post('/', protect, authorize('admin'), createPayment);
router.put('/:id', protect, authorize('admin'), updatePayment);

module.exports = router;
