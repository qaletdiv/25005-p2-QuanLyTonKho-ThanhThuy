const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const vendorController = require('../controllers/vendorController');

router.get('/api/vendors', isAuthenticated, vendorController.getAllVendors);
router.get('/api/vendors/:id', isAuthenticated, vendorController.getVendorDetail);
router.post('/api/vendors', isAuthenticated, vendorController.createVendor);
router.put('/api/vendors/:id', isAuthenticated, vendorController.updateVendor);

router.get('/vendors-list', isAuthenticated, vendorController.renderVendorsList);
router.get('/vendor-detail', isAuthenticated, vendorController.renderVendorDetail);

module.exports = router;
