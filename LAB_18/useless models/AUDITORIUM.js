const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('AUDITORIUM', {
    AUDITORIUM: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      primaryKey: true
    },
    AUDITORIUM_NAME: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    AUDITORIUM_CAPACITY: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    AUDITORIUM_TYPE: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      references: {
        model: 'AUDITORIUM_TYPE',
        key: 'AUDITORIUM_TYPE'
      }
    }
  }, {
    sequelize,
    tableName: 'AUDITORIUM',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK__AUDITORI__537260106CC2CA77",
        unique: true,
        fields: [
          { name: "AUDITORIUM" },
        ]
      },
    ]
  });
};
