const express = require('express');
const router = express.Router();
const { getProducts, getProduct, getRelatedProducts, createProduct, updateProduct, deleteProduct, getSeasonalProducts } = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getProducts);
router.get('/seasonal', getSeasonalProducts);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);
router.post('/', protect, adminOnly, createProduct);
router.put('/:id', protect, adminOnly, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
