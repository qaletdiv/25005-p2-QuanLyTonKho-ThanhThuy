const express = require('express');
const router = express.Router();
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware');
const stockController = require('../controllers/stockController');

router.get('/api/stock', isAuthenticated, hasRole('admin', 'nhanvienkho'), stockController.getAllStock);

router.get('/stock', isAuthenticated, hasRole('admin', 'nhanvienkho'), (req, res) => {
    res.render('stock', { user: req.session.user });
});

module.exports = router;
