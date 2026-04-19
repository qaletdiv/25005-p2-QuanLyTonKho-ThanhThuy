const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.hasMany(models.OrderProduct, { foreignKey: 'productId', as: 'orderProducts' });
            Product.hasOne(models.Stock, { foreignKey: 'productId', as: 'stock' });
        }
    }

    Product.init(
        {
            itemCode: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                field: 'itemCode'
            },
            itemName: {
                type: DataTypes.STRING,
                allowNull: false,
                field: 'itemName'
            },
            unit: {
                type: DataTypes.STRING,
                defaultValue: 'kg'
            },
            price: {
                type: DataTypes.DECIMAL(15, 2),
                defaultValue: 0
            }
        },
        {
            sequelize,
            modelName: 'Product',
            tableName: 'products',
            timestamps: true
        }
    );
    return Product;
};