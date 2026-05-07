const { Op } = require('sequelize');
const { Product } = require('../models');

exports.getAllProducts = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};
        if (search) {
            where = {
                [Op.or]: [
                    { itemCode: { [Op.like]: `%${search}%` } },
                    { itemName: { [Op.like]: `%${search}%` } }
                ]
            };
        }
        const products = await Product.findAll({ where });
        const data = products.map(p => ({
            item_CD: p.itemCode,
            item_name: p.itemName,
            unit: p.unit,
            price: p.price
        }));
        res.json({ success: true, data });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Lỗi hệ thống' });
    }
};

exports.getProductDetail = async (req, res) => {
    try {
        const { itemCode } = req.params;
        const product = await Product.findOne({ where: { itemCode } });
        if (!product) {
            return res.json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }
        res.json({
            success: true,
            data: {
                item_CD: product.itemCode,
                item_name: product.itemName,
                unit: product.unit,
                price: product.price
            }
        });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Lỗi hệ thống' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { item_CD, item_name, unit, price } = req.body;
        const exists = await Product.findOne({ where: { itemCode: item_CD } });
        if (exists) {
            return res.status(400).json({ success: false, message: 'Mã sản phẩm đã tồn tại' });
        }
        await Product.create({ itemCode: item_CD, itemName: item_name, unit, price });
        res.json({ success: true, message: 'Tạo sản phẩm thành công' });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Lỗi hệ thống' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { itemCode } = req.params;
        const { item_name, unit, price } = req.body;
        const product = await Product.findOne({ where: { itemCode } });
        if (!product) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }
        await product.update({ itemName: item_name, unit, price });
        res.json({ success: true, message: 'Cập nhật sản phẩm thành công' });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Lỗi hệ thống' });
    }
};

exports.renderProductList = (req, res) => {
    res.render('products-list', { user: req.session.user });
}

exports.renderProductDetail = (req, res) => {
    res.render('product-detail', { user: req.session.user });
}