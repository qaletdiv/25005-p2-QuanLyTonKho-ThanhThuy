const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const stockController = require('../controllers/stockController');

router.get('/api/stock', isAuthenticated, stockController.getAllStock);

router.get('/stock', isAuthenticated, (req, res) => {
    res.render('stock', { user: req.session.user });
});

module.exports = router;
