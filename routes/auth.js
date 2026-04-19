const express = require('express');
const router = express.Router();
const { getLogin, postLogin, logout } = require('../controllers/authController');
const { loginValidation } = require('../validations/authValidation');
const { validateMiddleware } = require('../middleware/validateMiddleware');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/login', getLogin);
router.post('/login', loginValidation, validateMiddleware, postLogin);
router.get('/logout', logout);

router.get('/orders-list', isAuthenticated, (req, res) => {
    res.render('orders-list', { user: req.session.user });
});

router.get('/order-detail', isAuthenticated, (req, res) => {
    res.render('order-detail', { user: req.session.user });
});

module.exports = router;