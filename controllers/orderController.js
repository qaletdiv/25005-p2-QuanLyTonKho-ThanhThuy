const { Op } = require('sequelize');
const { Order, Vendor, OrderProduct, Product } = require('../models');

exports.getAllOrders = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};
        let includeOpts = [
            { model: Vendor, as: 'vendor' },
            { model: OrderProduct, as: 'orderProducts' }
        ];

        const orders = await Order.findAll({ where, include: includeOpts });

        let data = orders.map(o => ({
            orderNo: o.orderNo,
            vendorName: o.vendor ? o.vendor.vendorName : '', 
            orderDate: o.orderDate,
            handler: o.handler,
            totalAmount: o.orderProducts ? o.orderProducts.reduce((sum, op) => sum + (op.quantity * op.unitPrice), 0) : 0,
            status: o.status
        }));

        if (search) {
            const keyword = search.toLowerCase();
            data = data.filter(d =>
                d.orderNo.toLowerCase().includes(keyword) ||
                d.vendorName.toLowerCase().includes(keyword) ||
                d.handler.toLowerCase().includes(keyword)
            );
        }

        res.json({ success: true, data });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Lỗi hệ thống' });
    }
};

exports.getOrderDetail = async (req, res) => {
    try {
        const { orderNo } = req.params;
        const order = await Order.findOne({
            where: { orderNo },
            include: [
                { model: Vendor, as: 'vendor' },
                {
                    model: OrderProduct,
                    as: 'orderProducts',
                    include: [{ model: Product, as: 'product' }]
                }
            ]
        });

        if (!order) {
            return res.json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }
        const orderProducts = order.orderProducts.map(op => ({
            itemCode: op.product ? op.product.itemCode : '',
            itemName: op.product ? op.product.itemName : '',
            quantity: op.quantity,
            unitPrice: op.unitPrice
        }));

        res.json({
            success: true,
            data: {
                orderNo: order.orderNo,
                vendorName: order.vendor ? order.vendor.vendorName : '',
                orderDate: order.orderDate,
                handler: order.handler,
                totalAmount: order.orderProducts ? order.orderProducts.reduce((sum, op) => sum + (op.quantity * op.unitPrice), 0) : 0,
                status: order.status,
                orderProducts
            }
        });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Lỗi hệ thống' });
    }
};



exports.createOrder = async (req, res) => {
    try {
        const { vendorName, orderDate, handler, status, note, orderProducts } = req.body;

        // Tìm vendor theo tên
        const vendor = await Vendor.findOne({ where: { vendorName } });
        if (!vendor) {
            return res.status(400).json({ success: false, message: 'Nhà cung cấp không tồn tại' });
        }
        
        // Tạo mã đơn hàng 
        const lastOrder = await Order.findOne({ order: [['id', 'DESC']] });
        const nextNum = lastOrder ? lastOrder.id + 1 : 1;
        const orderNo = 'PO' + String(nextNum).padStart(3, '0');

        const order = await Order.create({
            orderNo,
            vendorId: vendor.id,
            orderDate,
            handler,
            status: status || 'Bản nháp',
            note
        });

        for (const op of orderProducts) {
            const product = await Product.findOne({ where: { itemCode: op.itemCode } });
            if (product) {
                await OrderProduct.create({
                    orderId: order.id,
                    productId: product.id,
                    quantity: op.quantity,
                    unitPrice: product.price
                });
            }
        }

        res.json({ success: true, message: 'Tạo đơn hàng thành công', data: { orderNo: order.orderNo } });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Lỗi hệ thống' });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const { orderNo } = req.params;
        const { vendorName, orderDate, handler, note, orderProducts } = req.body;

        const order = await Order.findOne({ where: { orderNo } });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }

        if (order.status !== 'Bản nháp') {
            return res.status(400).json({ success: false, message: 'Chỉ có thể chỉnh sửa đơn hàng ở trạng thái Bản nháp' });
        }

        const vendor = await Vendor.findOne({ where: { vendorName } });
        if (!vendor) {
            return res.status(400).json({ success: false, message: 'Nhà cung cấp không tồn tại' });
        }
            

        await order.update({ vendorId: vendor.id, orderDate, handler, note });

        // Xóa orderProducts cũ, tạo mới
        await OrderProduct.destroy({ where: { orderId: order.id } });
        for (const op of orderProducts) {
            const product = await Product.findOne({ where: { itemCode: op.itemCode } });
            if (product) {
                await OrderProduct.create({
                    orderId: order.id,
                    productId: product.id,
                    quantity: op.quantity,
                    unitPrice: product.price
                });
            }
        }

        res.json({ success: true, message: 'Cập nhật đơn hàng thành công', data: { orderNo: order.orderNo } });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Lỗi hệ thống' });
    }
};

exports.confirmOrder = async (req, res) => {
    try {
        const { orderNo } = req.params;
        const order = await Order.findOne({ where: { orderNo } });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }
        await order.update({ status: 'Đã xác nhận' });
        res.json({ success: true, message: 'Đã xác nhận đơn hàng' });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Lỗi hệ thống' });
    }
};

exports.confirmStock = async (req, res) => {
    try {
        const { orderNo } = req.params;
        const order = await Order.findOne({ where: { orderNo } });
        if (!order) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy đơn hàng' });
        }

        if (order.status !== 'Đã xác nhận') {
            return res.status(400).json({ success: false, message: 'Chỉ có thể nhập kho đơn hàng ở trạng thái Đã xác nhận' });
        }

        const { Stock } = require('../models');
        const orderProducts = await OrderProduct.findAll({ where: { orderId: order.id } });

        for (const op of orderProducts) {
            let stock = await Stock.findOne({ where: { productId: op.productId } });
            if (stock) {
                await stock.update({ quantity: stock.quantity + op.quantity });
            } else {
                await Stock.create({ productId: op.productId, quantity: op.quantity });
            }
        }

        await order.update({ status: 'Đã nhập kho' });
        res.json({ success: true, message: 'Đã nhập kho thành công' });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Lỗi hệ thống' });
    }
};

exports.renderOrdersList = (req, res) => {
    res.render('orders-list', { user: req.session.user });
};

exports.renderOrderDetail = (req, res) => {
    res.render('order-detail', { user: req.session.user });
};