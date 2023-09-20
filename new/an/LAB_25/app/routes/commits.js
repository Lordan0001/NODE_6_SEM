const express = require('express');
const commitsService = require("../services/commitService");
const repoService = require('../services/repoService');
const router = express.Router({ mergeParams: true });

class Repos {
    constructor(attrs) {
        Object.assign(this, attrs);
    }
}

router.get('/', async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const commits = await commitsService.GetAll(id);
    return res.send(commits);
});

router.get('/:commitId', async (req, res) => {
    const id = req.params.commitId
    const repId = req.params.id
    const commits = await commitsService.GetById(id)
    if (!commits)
        return res.status(404).send('Commits not found');
    return res.send(commits);
});

router.post('/', async (req, res) => {
    try {
        const repo = await repoService.GetById(req.body.repoId)
        if(repo===null){
            return res.status(404).send('Repos not found');
        }
        console.log('dsadsa')
        console.log(repo)
        const repoHandler = new Repos(repo.dataValues);
        console.log(repoHandler);
        if (!req.ability.can('update', repoHandler)) {
            return res.status(403).send({ message: 'You are not allowed to do this!' })
        }
        // const id = req.params.id
        const commits = await commitsService.AddCommits(req.body);
        return res.send(commits);
    }
    catch (e) {
        console.log(e);
        return res.status(500).send('Server error');
    }
});

router.put('/:commitId', async (req, res) => {
    const idC = req.params.commitId
    const idR = req.params.id
    const repo = await commitsService.GetById(idC)

    if(repo===null){
        return res.status(403).send({ message: 'You are not allowed to do this!' })
    }
    else {
        const comRule = new Commits(repo.dataValues.Repo.dataValues);

        if (!req.ability.can('update', comRule)) {
            return res.status(403).send({message: 'You are not allowed to do this!'})
        }
        console.log('idC')
        console.log(idC)
        console.log(req.body)
        const commits = await commitsService.UpdateById(idC, req.body)
        console.log(commits)
        if (commits[0] !== 1)
            return res.status(404).send('Commits not found');
        return res.send(req.body);
    }
});

router.delete('/:commitId', async (req, res) => {
    const id = req.params.commitId
    const commit = await commitsService.GetById(id)
    if(commit===null){
        return res.status(404).send('Commits not found');
    }
    else {
        const commitHandler = new Commits(commit.dataValues.Repo.dataValues);
        console.log(commitHandler);
        if (!req.ability.can('delete', commitHandler)) {
            return res.status(403).send({message: 'You are not allowed to do this!'})
        }
        const commits = await commitsService.DeleteById(id)
        console.log(commits);
        if (!commits)
            return res.status(404).send('Commits not found');
        return res.send({status: true});
    }
});
module.exports = router;
