const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Order extends Model {
        static associate(models) {
            Order.belongsTo(models.Vendor, { foreignKey: 'vendorId', as: 'vendor' });
            Order.hasMany(models.OrderProduct, { foreignKey: 'orderId', as: 'orderProducts' });
        }
    }

    Order.init(
        {
            orderNo: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                field: 'orderNo'
            },
            vendorId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'vendorId'
            },
            orderDate: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                field: 'orderDate'
            },
            handler: DataTypes.STRING,
            status: {
                type: DataTypes.ENUM('Bản nháp', 'Đã xác nhận', 'Đã nhập kho'),
                defaultValue: 'Bản nháp'
            },
            note: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Order',
            tableName: 'orders',
            timestamps: true
        }
    );
    return Order;
};