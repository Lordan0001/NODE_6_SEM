const sequelize = require('../config/db');
const { DataTypes } = require("sequelize");
const bcrypt = require('bcrypt')

const User = sequelize.define(
    'User',
    {
        username: { type: DataTypes.STRING, allowNull: true },
        email: { type: DataTypes.STRING, allowNull: false, unique: true },
        password: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.ENUM('guest', 'registered', 'admin'), defaultValue: 'guest' },
    },
    {
        hooks: {
            beforeCreate: async (user) => {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            },
            beforeUpdate: async (user) => {
                if (user.changed('password')) {
                    const salt = await bcrypt.genSalt(10);
                    user.password = await bcrypt.hash(user.password, salt);
                }
            },
        },
    }
);

User.prototype.validPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};


const Repo = sequelize.define('Repo',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Repo',
    }
);


const Commit = sequelize.define('Commit',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Commit',
    }
);

Commit.belongsTo(Repo, { foreignKey: 'repoId' });
User.hasMany(Repo, { foreignKey: 'authorId' })
Repo.belongsTo(User, { foreignKey: 'authorId' })
Repo.hasMany(Commit, { foreignKey: 'repoId' });

// class Repos {
//     constructor(attrs) {
//         Object.assign(this, attrs);
//     }
// }

module.exports = {
    User,
    Commit,
    Repo
}