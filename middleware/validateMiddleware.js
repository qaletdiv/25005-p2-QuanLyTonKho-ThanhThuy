const {validateResult} = require('express-validator');

exports.validateMiddleware = (req,res,next) => {
    const errors = validateResult(req);

    if(!errors.isEmpty()){
        return res.render('login', {
            error: errors.array()[0].msg
        });
    }

    next();

};