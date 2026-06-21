const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const ADMIN_SECRET_CODE = process.env.ADMIN_SECRET_CODE || 'FLORA-ADMIN-2024';

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Register
const register = async (req, res) => {
  try {
    const { name, email, password, role, adminCode } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    let finalRole = 'user';
    if (role === 'admin') {
      if (adminCode !== ADMIN_SECRET_CODE) {
        return res.status(403).json({ message: 'Invalid admin secret code' });
      }
      finalRole = 'admin';
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: finalRole });

    res.status(201).json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      _id: user._id, name: user.name, email: user.email, role: user.role,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').populate('wishlist');
    res.json(user);
  } catch {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { register, login, getProfile };
