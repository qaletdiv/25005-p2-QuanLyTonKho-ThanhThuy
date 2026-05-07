exports.isAuthenticated = (req,res,next) => {
    if(req.session.user){
        return next();
    }
    return res.redirect('/login');
};

exports.hasRole = (...roles) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/login'); 
        }
        if (!roles.includes(req.session.user.role)) {
            return res.status(403).send('Bạn không có quyền truy cập');
        }
        return next();
    }
};