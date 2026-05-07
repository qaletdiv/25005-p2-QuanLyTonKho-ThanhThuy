const { Op } = require('sequelize');
const { Stock, Product } = require('../models');

exports.getAllStock = async (req, res) => {
    try {
        const { search } = req.query;
        const stocks = await Stock.findAll({
            include: [{ model: Product, as: 'product' }]
        });

        let data = stocks.map(s => ({
            item_CD: s.product ? s.product.itemCode : '',
            item_name: s.product ? s.product.itemName : '',
            stock: s.quantity
        }));

        if (search) {
            const keyword = search.toLowerCase();
            data = data.filter(d =>
                d.item_CD.toLowerCase().includes(keyword) ||
                d.item_name.toLowerCase().includes(keyword)
            );
        }

        res.json({ success: true, data });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Lỗi hệ thống' });
    }
};