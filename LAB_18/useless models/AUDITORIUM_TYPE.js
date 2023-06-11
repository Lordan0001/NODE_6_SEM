const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AUDITORIUM_TYPE', {
    AUDITORIUM_TYPE: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      primaryKey: true
    },
    AUDITORIUM_TYPENAME: {
      type: DataTypes.STRING(30),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'AUDITORIUM_TYPE',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "AUDITORIUM_TYPE_PK",
        unique: true,
        fields: [
          { name: "AUDITORIUM_TYPE" },
        ]
      },
    ]
  });
};
