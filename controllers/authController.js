const {User} = require('../models');
const bcrypt = require('bcrypt');

exports.getLogin = async (req,res) => {
    res.render('login');
}

exports.postLogin = async (req,res) => {
    try{
        const{userId, userPassword} = req.body;
        if(!userId || !userPassword){
            return res.json({
                success: false,
                message: 'vui lòng nhập user ID,password'
            });
        }

        const user = await User.findOne({where:{userId}});

        if(!user){
            return res.json({
                success: false,
                message: 'userId hoặc password không đúng'
            });
        }
        const isMatch = await bcrypt.compare(userPassword,user.userPassword);
        if(!isMatch){
            return res.json({
                success: false,
                message: 'userId hoặc password không đúng'
            });
        }

        req.session.user = {
            userId: user.userId,
            role: user.role
        };

        return res.json({success: true});

    }catch(err){
        console.error(err);
        res.json({success: false, message: 'loi he thong'});
    }
}

exports.logout = (req,res) => {
    req.session.destroy();
    res.redirect('/login');
};