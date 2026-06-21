const Order = require('../models/Order');
const Product = require('../models/Product');

const createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount, paymentStatus } = req.body;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.product}` });
      if (product.stock < item.quantity) return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
    }
    const order = await Order.create({
      user: req.user._id, items, shippingAddress,
      paymentMethod: paymentMethod || 'COD',
      paymentStatus: paymentStatus || 'Pending',
      totalAmount,
      trackingHistory: [{ status: 'Placed', timestamp: new Date() }],
    });
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, sold: item.quantity } });
    }
    res.status(201).json(order);
  } catch (err) { res.status(500).json({ message: 'Server error', error: err.message }); }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product', 'name image price')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: 'Server error', error: err.message }); }
};

const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name image price');
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Not authorized' });
    res.json(order);
  } catch (err) { res.status(500).json({ message: 'Server error', error: err.message }); }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Not authorized' });
    if (['Shipped','Out for Delivery','Delivered'].includes(order.status))
      return res.status(400).json({ message: 'Cannot cancel order at this stage' });
    order.status = 'Cancelled';
    await order.save();
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity, sold: -item.quantity } });
    }
    res.json(order);
  } catch (err) { res.status(500).json({ message: 'Server error', error: err.message }); }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product', 'name image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) { res.status(500).json({ message: 'Server error', error: err.message }); }
};

// FIX: use findByIdAndUpdate to avoid validation issues with old orders
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });

    const validStatuses = ['Placed','Confirmed','Packed','Shipped','Out for Delivery','Delivered','Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status,
        $push: { trackingHistory: { status, timestamp: new Date() } }
      },
      { new: true, runValidators: false }
    ).populate('user', 'name email');

    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'Cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalProducts = await Product.countDocuments();
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 }).limit(5);
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalProducts,
      recentOrders,
      ordersByStatus,
    });
  } catch (err) { res.status(500).json({ message: 'Server error', error: err.message }); }
};

module.exports = { createOrder, getMyOrders, getOrder, cancelOrder, getAllOrders, updateOrderStatus, getDashboardStats };
