const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class OrderProduct extends Model {
        static associate(models) {
            OrderProduct.belongsTo(models.Order, { foreignKey: 'orderId', as: 'order' });
            OrderProduct.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
        }
    }

    OrderProduct.init(
        {
            orderId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'orderId'
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                field: 'productId'
            },
            quantity: {
                type: DataTypes.INTEGER,
                defaultValue: 0
            },
            unitPrice: {
                type: DataTypes.DECIMAL(15, 2),
                defaultValue: 0,
                field: 'unitPrice'
            }
        },
        {
            sequelize,
            modelName: 'OrderProduct',
            tableName: 'orderproducts',
            timestamps: true,
        }
    );
    return OrderProduct;
};