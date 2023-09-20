const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

class Repos {
    constructor(id,name, authorId){
        this.id = id;
        this.name = name;
        this.authorId = authorId;
    }
}

const getCommits = async (request, response) => {
    try{
        let commits = await prisma.commits.findMany({where:{repoId: +request.params.id}});
        response.end(JSON.stringify(commits));
    } catch(err){
        console.log(err.message);
        response.status(500).end(JSON.stringify({message:err.message}));
    }    
}

const getCommit = async (request, response) => {
    try{
        let commits = await prisma.commits.findMany({where:{repoId: +request.params.id, id: +request.params.commitId}});
        response.end(JSON.stringify(commits));
    } catch(err){
        console.log(err.message);
        response.status(500).end(JSON.stringify({message:err.message}));
    }    
}

const addCommit = async (request, response) => {
    try{
        let {message} = request.body;
        let repo = await prisma.repos.findFirst({where:{id: +request.params.id}});
        if(!repo)return response.status(500).send(JSON.stringify({message: 'repos not found'}))
        request.ability.throwUnlessCan(
            'create',
            new Repos(repo.id, repo.name, repo.authorId)
        )
        await prisma.commits.create({
            data:{
                message,
                repoId: +request.params.id
            }
        });
        response.redirect(`/api/repos/${request.params.id}/commits`);
    } catch(err){
        console.log(err.message);
        response.status(500).end(JSON.stringify({message:err.message}));
    }    
}

const updCommit = async (request, response) => {
    try{
        let {message} = request.body;
        let repo = await prisma.repos.findFirst({where:{id: +request.params.id}});
        if(!repo)return response.status(500).send(JSON.stringify({message: 'repos not found'}))
        request.ability.throwUnlessCan(
            'create',
            new Repos(repo.id, repo.name, repo.authorId)
        )
        await prisma.commits.update({
            where: {
                id: +request.params.commitId,
            },
            data:{
                message,
                repoId: +request.params.id
            }
        });
        response.redirect(`/api/repos/${request.params.id}/commits`);
    } catch(err){
        console.log(err.message);
        response.status(500).end(JSON.stringify({message:err.message}));
    }    
}

const delCommit = async (request, response) => {
    try{
        console.log(request.user.role);
        request.ability.throwUnlessCan("manage", "all");
        await prisma.commits.delete({
            where: {
                id: +request.params.commitId,
            }
        });
        response.redirect(`/api/repos/${request.params.id}/commits`);
    } catch(err){
        console.log(err.message);
        response.status(500).end(JSON.stringify({message:err.message}));
    }    
}

module.exports = {
    getCommits, getCommit, addCommit, updCommit, delCommit
}