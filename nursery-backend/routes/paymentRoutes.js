const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyPayment, markPaymentFailed } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);
router.post('/failed', protect, markPaymentFailed);

module.exports = router;
