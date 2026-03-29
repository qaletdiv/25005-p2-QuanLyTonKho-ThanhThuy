const {User} = require('../models');
const bcrypt = require('bcrypt');

exports.getLogin = async (req,res) => {
    res.render('login');
}

exports.postLogin = async (req,res) => {
    try{
        const{userId, password} = req.body;
        if(!userId || !password){
            return res.render('login', {error: 'vui long nhap day du thong tin'});
        }

        const user = await User.findOne({where:{userId}});
        if(!user){
            return res.render('login',{error: 'Tai khoan khong ton tai'});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.render('login',{error: 'Mat khau khong chinh xac'});
        }

        req.session.user = {
            userId: user.userId,
            role: user.role
        };
        res.redirect('/orders-list');

    }catch(err){
        console.error(err);
        res.render('login',{error:'loi he thong'});
    }
}

exports.logout = (req,res) => {
    req.session.destroy();
    res.redirect('/login');
};