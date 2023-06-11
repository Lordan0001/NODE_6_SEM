const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('SUBJECT', {
    SUBJECT: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      primaryKey: true
    },
    SUBJECT_NAME: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    PULPIT: {
      type: DataTypes.CHAR(10),
      allowNull: false,
      references: {
        model: 'PULPIT',
        key: 'PULPIT'
      }
    }
  }, {
    sequelize,
    tableName: 'SUBJECT',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_SUBJECT",
        unique: true,
        fields: [
          { name: "SUBJECT" },
        ]
      },
    ]
  });
};
