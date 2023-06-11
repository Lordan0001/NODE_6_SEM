const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FACULTY', {
    FACULTY: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    FACULTY_NAME: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'FACULTY',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_FACULTY",
        unique: true,
        fields: [
          { name: "FACULTY" },
        ]
      },
    ]
  });
};
