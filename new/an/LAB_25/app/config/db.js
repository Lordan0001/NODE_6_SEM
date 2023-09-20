const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('lab_251', 'root', 'cxUTyjp4Urjb6tz0YBes', {
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
});

module.exports = sequelize;