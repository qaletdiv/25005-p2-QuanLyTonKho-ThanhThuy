const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.js')[env];
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.User = require('./user')(sequelize, Sequelize);
db.Order = require('./order')(sequelize, Sequelize);
db.Vendor = require('./vendor')(sequelize, Sequelize);
db.Product = require('./product')(sequelize, Sequelize);
db.OrderProduct = require('./orderProduct')(sequelize, Sequelize);
db.Stock = require('./stock')(sequelize, Sequelize);

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;