const {body} = require('express-validator');

exports.loginValidation = [
    body('userID')
    .notEmpty().withMessage('User ID không được để trống')
    .isLength({min:3}).withMessage('UserID phải có ít nhất 3 ký tự'),

    body('userPassword')
    .notEmpty().withMessage('Password không được để trống')
    .isLength({min:6}).withMessage('Password phải có ít nhất 6 ký tự'),
];