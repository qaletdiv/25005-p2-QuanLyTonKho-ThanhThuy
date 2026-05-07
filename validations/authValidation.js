const {body} = require('express-validator');

exports.loginValidation = [
    body('userId')
    .notEmpty().withMessage('User ID không được để trống')
    .isLength({min:2}).withMessage('UserID phải có ít nhất 2 ký tự'),

    body('userPassword')
    .notEmpty().withMessage('Password không được để trống')
    .isLength({min:6}).withMessage('Password phải có ít nhất 6 ký tự'),
];