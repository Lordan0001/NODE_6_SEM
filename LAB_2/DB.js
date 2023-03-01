const Sequelize = require("sequelize");
const sequelize = new Sequelize("Node_14", "SYS", "orcl",
{
    dialect: "mssql",
    host: "localhost",
    port: "1433",
    pool: {
        max: 10,
        min: 0,
        idle: 10000,
        acquire: 100000
    }
});

module.exports = sequelize;
