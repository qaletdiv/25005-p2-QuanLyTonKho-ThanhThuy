const { Op } = require('sequelize');
const {Order, Vendor} = require('../models');

exports.getAllOrders = async(req,res) => {
    try{
        const orders = await Order.findAll({include: [Vendor]});
        res.json({success:true, data: orders});
    }catch(err){
        res.json({success: false, message: 'loi he thong'});

    }

};

exports.getOrders = async (req, res) => {
    try {
        const { orderNo, vendorName } = req.query;
        let where = {};
        let include = [Vendor];
        if (orderNo) where.orderNo = orderNo;
        if (vendorName) {
            include = [{
                model: Vendor,
                as: 'vendor',
                where: { vendorName: { [Op.like]: `%${vendorName}%` } }
            }];
        }
        const orders = await Order.findAll({ where, include });
        res.json({ success: true, data: orders });
    } catch (err) {
        res.json({ success: false, message: 'loi he thong' });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const { orderNo, vendorName } = req.query;
        let where = {};
        let include = [Vendor];
        if (orderNo) where.orderNo = orderNo;
        if (vendorName) {
            include = [{
                model: Vendor,
                as: 'vendor',
                where: { vendorName: { [Op.like]: `%${vendorName}%` } }
            }];
        }
        const orders = await Order.findAll({ where, include });
        res.json({ success: true, data: orders });
    } catch (err) {
        res.json({ success: false, message: 'loi he thong' });
    }
};

exports.getOrderDetail = async (req, res) => {
    try{
        const {orderNo} = req.params;
        const order = await Order.findOne({
            where: {orderNo},
            include: [
                {model: Vendor, as: 'vendor'},
                {model: OrderProduct, as: 'orderProducts', include:[{model: Product, as: 'product'}]}
            ]
        });
        if(!order){
            return res.json({success: false, message: 'Đơn hàng không tồn tại'});
        }
        res.json({success: true, data: order});
    }catch(err){
        res.json({success: false, message: 'loi he thong'});

    }

};

exports.createOrder = async (req, res) => {
    try {
        const { orderNo, vendorId, orderDate, handler, status, note, orderProducts } = req.body;
        // Tạo order
        const order = await Order.create({
            orderNo, vendorId, orderDate, handler, status, note
        });

        for (const op of orderProducts) {
            await OrderProduct.create({
                orderId: order.id,
                productId: op.productId,
                quantity: op.quantity,
                unit_price: op.unit_price
            });
        }

        res.json({ success: true, data: order });
    } catch (err) {
        res.json({ success: false, message: 'Lỗi hệ thống' });
    }
};