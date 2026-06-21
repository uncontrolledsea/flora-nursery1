const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

const getRazorpay = () => new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
    res.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ message: 'Payment initiation failed', error: err.message });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex');

    if (expected !== razorpay_signature) return res.status(400).json({ message: 'Invalid payment signature' });

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'Paid', status: 'Confirmed',
        $push: { trackingHistory: { status: 'Confirmed', timestamp: new Date(), note: `Payment: ${razorpay_payment_id}` } },
      });
    }
    res.json({ success: true, paymentId: razorpay_payment_id });
  } catch (err) { res.status(500).json({ message: 'Verification failed', error: err.message }); }
};

// Mark an order's payment as failed (called from frontend payment.failed event)
const markPaymentFailed = async (req, res) => {
  try {
    const { orderId, reason } = req.body;
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'Pending',
        $push: { trackingHistory: { status: 'Placed', timestamp: new Date(), note: `Payment attempt failed: ${reason || 'unknown reason'}` } },
      });
    }
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: 'Failed to log payment failure', error: err.message }); }
};

module.exports = { createRazorpayOrder, verifyPayment, markPaymentFailed };
