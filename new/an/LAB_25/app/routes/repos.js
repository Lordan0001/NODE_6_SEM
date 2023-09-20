const express = require('express');
const reposService = require("../services/repoService");
const router = express.Router({ mergeParams: true });
const commitsRouter = require('./commits');
const { User, Commit } = require('../models/models');
const checkRole = require('../middleware/checkRole');
const { verifyToken } = require('../config/auth');

class Repos {
    constructor(attrs) {
        Object.assign(this, attrs);
    }
}

router.get('/', async (req, res) => {
    const repos = await reposService.GetAll()
    return res.send(repos);
});

router.get('/:id', async (req, res) => {
    const id = req.params.id
    const repos = await reposService.GetById(id)

    if (!repos)
        return res.status(404).send('Repos not found');

    return res.send(repos);
});

router.post('/', async (req, res) => {
    console.log(req.user);
    try {
        if (!req.ability.can('add', 'Repos')) {
            return res.status(403).send({ message: 'You are not allowed to do this!' })
        }
        const repoHandler = {
            name: req.body.name,
            authorId: req.user.id
        }
        const repos = await reposService.AddRepos(repoHandler);
        return res.send(repos);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Server error');
    }
});

router.put('/:id', verifyToken, checkRole, async (req, res) => {
    const id = req.params.id
    const repo = await reposService.GetById(id, req.body)
    if(repo===null){
        res.status(404).send('Repos not found');
    }
    else {
        const repoHandler = new Repos(repo.dataValues);
        console.log(repoHandler)

        if (!req.ability.can('update', repoHandler)) {
            return res.status(403).send({message: 'You are not allowed to do this!'})
        }
        const repos = await reposService.UpdateById(id, req.body)
        if (repos[0] !== 1)
            return res.status(404).send('Repos not found');
        return res.send(req.body);
    }
});

router.delete('/:id', verifyToken, checkRole, async (req, res) => {
    const id = req.params.id
    const repo = await reposService.GetById(id)
    if(!repo){
        return res.status(404).send('Repos not found');
    }
    const repoHandler = new Repos(repo.dataValues)
    if (!req.ability.can('delete', repoHandler)) {
        return res.status(403).send({message: 'You are not allowed to do this!'})
    }
    const repos = await reposService.DeleteById(id)
    console.log(repos);
    if (!repos)
        return res.status(404).send('Repos not found');
    return res.send({status: true});
});

router.use('/:id/commits/', commitsRouter);
module.exports = router;
