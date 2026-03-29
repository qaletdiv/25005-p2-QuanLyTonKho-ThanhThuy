exports.isAuthenticated = (req,res,next) => {
    if(req.session.user){
        return next();
    }
    return res.redirect('/login');
};

exports.hasRole = (...roles) => {
    return (req,res,next) => {
        if(!roles.includes(req.session.user.role)){
            return res.status(403).send('Ban khong co quyen truy cap');
        }
        return next();
    }
};