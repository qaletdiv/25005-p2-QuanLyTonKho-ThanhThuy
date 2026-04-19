const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const orderController = require('../controllers/orderController');

router.get('/api/orders', isAuthenticated, orderController.getAllOrders);
router.get('/api/orders/:orderNo', isAuthenticated, orderController.getOrderDetail);
router.post('/api/orders', isAuthenticated, orderController.createOrder);

module.exports = router;