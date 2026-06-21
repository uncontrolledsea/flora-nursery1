const User = require('../models/User');

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json(user.wishlist);
  } catch { res.status(500).json({ message: 'Server error' }); }
};

const toggleWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const productId = req.params.productId;
    const idx = user.wishlist.findIndex(id => id.toString() === productId);
    let added;
    if (idx === -1) { user.wishlist.push(productId); added = true; }
    else { user.wishlist.splice(idx, 1); added = false; }
    await user.save();
    const updated = await User.findById(req.user._id).populate('wishlist');
    res.json({ wishlist: updated.wishlist, added });
  } catch { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { getWishlist, toggleWishlist };
