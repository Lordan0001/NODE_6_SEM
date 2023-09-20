const config = require('../config');
const Sequelize = require("sequelize");

const sequelize = new Sequelize(config.db.database, config.db.username, config.db.password, {
    host: config.db.host, 
    dialect: config.db.dialect
})
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.users = require("./users")(Sequelize, sequelize);
db.repos = require("./repos")(Sequelize, sequelize);
db.commits = require("./commits")(Sequelize, sequelize);

db.users.hasMany(db.repos, { as: "repos" });
db.repos.belongsTo(db.users);

db.repos.hasMany(db.commits, { as: "commits" });
db.commits.belongsTo(db.users);

module.exports = db;
