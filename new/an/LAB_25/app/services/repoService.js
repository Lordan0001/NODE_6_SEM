const {User, Commit, Repo} = require('../models/models')

module.exports = {
    AddRepos: async (json) => {
        return await Repo.create({
            authorId: json.authorId,
            name: json.name
        });
    },
    GetAll: async () => {
        return await Repo.findAll({
            attributes: ['id', 'name'],
            include:
                {
                    model: User,
                    attributes: ['id', 'username']
                }
        });
    },
    GetById: async (id) => {
        try {
            return await Repo.findByPk(id, {
                attributes: ['id', 'name', 'authorId']
            });
        }
        catch{
            return null
        }
    },
    UpdateById: async (id, repos) => {
        try {
            return await Repo.update(repos, {where: {id}});
        }
        catch{
            return null
        }
    },
    DeleteById: async (id) => {
        try {
            return await Repo.destroy({where: {id}});
        }
        catch{
            return null;
        }
    },
};
