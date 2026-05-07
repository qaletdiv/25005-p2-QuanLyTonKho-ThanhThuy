const { Op } = require('sequelize');
const { Vendor } = require('../models');

exports.getAllVendors = async (req, res) => {
    try {
        const { search } = req.query;
        let where = {};
        if (search) {
            where = {
                [Op.or]: [
                    { vendorName: { [Op.like]: `%${search}%` } },
                    { address: { [Op.like]: `%${search}%` } }
                ]
            };
        }
        const vendors = await Vendor.findAll({ where });
        const data = vendors.map(v => ({
            id: v.id,
            vendorName: v.vendorName,
            address: v.address || ''
        }));
        res.json({ success: true, data });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Lỗi hệ thống' });
    }
};

exports.getVendorDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await Vendor.findByPk(id);
        if (!vendor) {
            return res.json({ success: false, message: 'Không tìm thấy nhà cung cấp' });
        }
        res.json({
            success: true,
            data: {
                id: vendor.id,
                vendorName: vendor.vendorName,
                address: vendor.address || ''
            }
        });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Lỗi hệ thống' });
    }
};

exports.createVendor = async (req, res) => {
    try {
        const { vendorName, address } = req.body;
        if (!vendorName) {
            return res.status(400).json({ success: false, message: 'Tên NCC không được để trống' });
        }
        const exists = await Vendor.findOne({ where: { vendorName } });
        if (exists) {
            return res.status(400).json({ success: false, message: 'Tên NCC đã tồn tại' });
        }
        await Vendor.create({ vendorName, address });
        res.json({ success: true, message: 'Tạo nhà cung cấp thành công' });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Lỗi hệ thống' });
    }
};

exports.updateVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { vendorName, address } = req.body;
        const vendor = await Vendor.findByPk(id);
        if (!vendor) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy nhà cung cấp' });
        }
        await vendor.update({ vendorName, address });
        res.json({ success: true, message: 'Cập nhật nhà cung cấp thành công' });
    } catch (err) {
        console.error(err);
        res.json({ success: false, message: 'Lỗi hệ thống' });
    }
};

exports.renderVendorsList = (req, res) => {
    res.render('vendors-list', { user: req.session.user });
};

exports.renderVendorDetail = (req, res) => {
    res.render('vendor-detail', { user: req.session.user });
};
