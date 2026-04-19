const { User } = require('../models');
const bcrypt = require('bcrypt');

exports.getLogin = async (req, res) => {
    res.render('login');
};

exports.postLogin = async (req, res) => {
    try {
        const { userId, userPassword } = req.body;
        if (!userId || !userPassword) {
            return res.json({
                success: false,
                message: 'Vui lòng nhập User ID và Password'
            });
        }

        const user = await User.findOne({ where: { userId } });

        if (!user) {
            return res.json({
                success: false,
                message: 'User ID hoặc Password không đúng'
            });
        }

        const isMatch = await bcrypt.compare(userPassword, user.userPassword);
        if (!isMatch) {
            return res.json({
                success: false,
                message: 'User ID hoặc Password không đúng'
            });
        }

        req.session.user = {
            id: user.id,
            userId: user.userId,
            full_name: user.fullName,
            role: user.role
        };

        return res.json({ success: true });

    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Lỗi hệ thống' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};