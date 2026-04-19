const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Vendor extends Model {
        static associate(models) {
            Vendor.hasMany(models.Order, { foreignKey: 'vendorId', as: 'orders' });
        }
    }

    Vendor.init(
        {
            vendorName: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                field: 'vendorName'
            },
            address: DataTypes.STRING
        },
        {
            sequelize,
            modelName: 'Vendor',
            tableName: 'vendors',
            timestamps: true,
        }
    );
    return Vendor;
};