const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware');
const orderController = require('../controllers/orderController');

router.get('/api/orders', isAuthenticated, orderController.getAllOrders);
router.get('/api/orders/:orderNo', isAuthenticated, orderController.getOrderDetail);
router.post('/api/orders', isAuthenticated, orderController.createOrder);
router.put('/api/orders/:orderNo', isAuthenticated, orderController.updateOrder);
router.put('/api/orders/:orderNo/confirm', isAuthenticated, hasRole('admin', 'nhanvienmuahang'), orderController.confirmOrder);
router.put('/api/orders/:orderNo/stock', isAuthenticated, hasRole('admin', 'nhanvienkho'), orderController.confirmStock);

router.get('/orders-list', isAuthenticated, orderController.renderOrdersList);
router.get('/order-detail', isAuthenticated, orderController.renderOrderDetail);

module.exports = router;