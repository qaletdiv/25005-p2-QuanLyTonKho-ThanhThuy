const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');

router.get('/api/products', isAuthenticated, productController.getAllProducts);
router.get('/api/products/:itemCode', isAuthenticated, productController.getProductDetail);
router.post('/api/products', isAuthenticated, productController.createProduct);
router.put('/api/products/:itemCode', isAuthenticated, productController.updateProduct);

router.get('/products-list', isAuthenticated, productController.renderProductList);
router.get('/product-detail', isAuthenticated, productController.renderProductDetail);

module.exports = router;