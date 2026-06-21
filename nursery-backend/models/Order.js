const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:     String,
    image:    String,
    price:    Number,
    quantity: { type: Number, min: 1 },
  }],
  shippingAddress: {
    name: String, phone: String, address: String,
    city: String, state: String, pincode: String,
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Razorpay', 'Online', 'UPI', 'Card', 'NetBanking', 'Wallet'],
    default: 'COD'
  },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  totalAmount:   { type: Number, required: true },
  status: {
    type: String,
    enum: ['Placed','Confirmed','Packed','Shipped','Out for Delivery','Delivered','Cancelled'],
    default: 'Placed'
  },
  trackingHistory: [{ status: String, timestamp: { type: Date, default: Date.now }, note: String }],
}, { timestamps: true });

orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.trackingHistory.push({ status: this.status, timestamp: new Date() });
  }
  next();
});

module.exports = mongoose.model('Order', orderSchema);
