const {User, Commit, Repo} = require('../models/models')
module.exports = {
    AddUsers: async (json) => {
        return await User.create({
            username: json["username"],
            password: json["password"],
        });
    },
    FindByUsername: async (json) => {
        return await User.findAll({
            where: { username: json["username"] },
            raw: true,
        });
    },
    GetAll: async () => {
        return await User.findAll({
            attributes: ['id', 'username', 'age']
        });
    },
    GetById: async (id) => {
        return await User.findByPk(id, {
            attributes: ['id', 'username', 'age']
        });
    },
};
