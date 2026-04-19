const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
        
        }
    }

    User.init(
        {
            userId: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                    len: [3, 50]
                }
            },

            userPassword: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                    len: [6, 255]
                }
            },

            fullName: {
                type: DataTypes.STRING
            },

            role: {
                type: DataTypes.ENUM('admin', 'nhanvien', 'nhanvienkho', 'nhanvienmuahang'),
                allowNull: false,
                defaultValue: 'nhanvien'
            }
        },
        {
            sequelize,
            modelName: 'User',
            tableName: 'users',
            timestamps: true,
            underscored: true,

            hooks: {
                beforeCreate: async (user) => {
                    if (user.userPassword) {
                        user.userPassword = await bcrypt.hash(user.userPassword, 10);
                    }
                },

                beforeUpdate: async (user) => {
                    if (user.changed('userPassword')) {
                        user.userPassword = await bcrypt.hash(user.userPassword, 10);
                    }
                }
            }
        }
    );

    return User;
};