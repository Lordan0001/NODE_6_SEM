var DataTypes = require("sequelize").DataTypes;
var _AUDITORIUM = require("./AUDITORIUM");
var _AUDITORIUM_TYPE = require("./AUDITORIUM_TYPE");
var _FACULTY = require("./FACULTY");
var _PULPIT = require("./PULPIT");
var _SUBJECT = require("./SUBJECT");
var _TEACHER = require("./TEACHER");

function initModels(sequelize) {
  var AUDITORIUM = _AUDITORIUM(sequelize, DataTypes);
  var AUDITORIUM_TYPE = _AUDITORIUM_TYPE(sequelize, DataTypes);
  var FACULTY = _FACULTY(sequelize, DataTypes);
  var PULPIT = _PULPIT(sequelize, DataTypes);
  var SUBJECT = _SUBJECT(sequelize, DataTypes);
  var TEACHER = _TEACHER(sequelize, DataTypes);

  AUDITORIUM.belongsTo(AUDITORIUM_TYPE, { as: "AUDITORIUM_TYPE_AUDITORIUM_TYPE", foreignKey: "AUDITORIUM_TYPE"});
  AUDITORIUM_TYPE.hasMany(AUDITORIUM, { as: "AUDITORIa", foreignKey: "AUDITORIUM_TYPE"});
  PULPIT.belongsTo(FACULTY, { as: "FACULTY_FACULTY", foreignKey: "FACULTY"});
  FACULTY.hasMany(PULPIT, { as: "PULPITs", foreignKey: "FACULTY"});
  SUBJECT.belongsTo(PULPIT, { as: "PULPIT_PULPIT", foreignKey: "PULPIT"});
  PULPIT.hasMany(SUBJECT, { as: "SUBJECTs", foreignKey: "PULPIT"});
  TEACHER.belongsTo(PULPIT, { as: "PULPIT_PULPIT", foreignKey: "PULPIT"});
  PULPIT.hasMany(TEACHER, { as: "TEACHERs", foreignKey: "PULPIT"});

  return {
    AUDITORIUM,
    AUDITORIUM_TYPE,
    FACULTY,
    PULPIT,
    SUBJECT,
    TEACHER,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
