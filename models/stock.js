const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Stock extends Model {
        static associate(models) {
            Stock.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
        }
    }

    Stock.init(
        {
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
                field: 'productId'
            },
            quantity: {
                type: DataTypes.DECIMAL(10, 0),
                defaultValue: 0
            }
        },
        {
            sequelize,
            modelName: 'Stock',
            tableName: 'stock',
            timestamps: true
        }
    );
    return Stock;
};