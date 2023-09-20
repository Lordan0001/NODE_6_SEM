const { User, Commit, Repo } = require('../models/models')

module.exports = {
    AddCommits: async (json) => {
        return await Commit.create({
            repoId: json.repoId,
            message: json.message
        });
    },
    
    GetAll: async (id) => {
        return await Commit.findAll({
            attributes: ['id', 'message'],
            include: {
                model: Repo,
                attributes: ['id', 'name', 'authorId']
            },
            where: { repoId: id }
        });
    },
    
    GetById: async (id) => {
        return await Commit.findByPk(id, {
            attributes: ['id', 'message'],
            include: {
                model: Repo,
                attributes: ['id', 'name', 'authorId']
            }
        });
    },
    UpdateById: async (id, commits) => {
        return await Commit.update(commits, { where: { id } });
    },
    DeleteById: async (id) => {
        return await Commit.destroy({ where: { id } });
    },
};
