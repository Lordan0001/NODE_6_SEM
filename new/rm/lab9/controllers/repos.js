const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

class Repos {
    constructor(id,name, authorId){
        this.id = id;
        this.name = name;
        this.authorId = authorId;
    }
}

const getAll = async (request, response) => {
    try{
        console.log(123);
        let repos = await prisma.repos.findMany();
        response.end(JSON.stringify(repos));
    } catch(err){
        console.log(err.message);
        response.status(500).end(JSON.stringify({message:err.message}));
    }    
}

const getRepo = async (request, response) => {
    try{
        let id = +request.params.id;
        let repo = await prisma.repos.findFirst({where:{id: id}});
        response.end(JSON.stringify(repo));
    } catch(err){
        console.log(err.message);
        response.status(500).end(JSON.stringify({message:err.message}));
    }    
}

const addRepo = async (request, response) => {
    try{
        let {name} = request.body;
        request.ability.throwUnlessCan(
            'create',
            'Repos'
        )
        await prisma.repos.create({
            data:{
                name,
                authorId: request.user.id
            }
        });
        response.redirect('/api/repos');
    } catch(err){
        console.log(err.message);
        response.status(500).end(JSON.stringify({message:err.message}));
    }    
}

const updRepo = async (request, response) => {
    try{
        let repo = await prisma.repos.findFirst({where:{id: +request.params.id}});
        let {name} = request.body;
        if(!repo)return response.status(500).send(JSON.stringify({message: 'repos not found'}))
        request.ability.throwUnlessCan(
            'update',
            new Repos(repo.id, repo.name, repo.authorId)
        )
        await prisma.repos.update({
            where: {
                id: +request.params.id
            },
            data: {
                name
            }
        });
        response.redirect('/api/repos');
    } catch(err){
        console.log(err.message);
        response.status(500).end(JSON.stringify({message:err.message}));
    }    
}

const delRepo = async (request, response) => {
    try{
        request.ability.throwUnlessCan("manage", "all");
        await prisma.repos.delete({
            where: {id: +request.params.id}
        });
        response.redirect('/api/repos');
    } catch(err){
        console.log(err.message);
        response.status(500).end(JSON.stringify({message:err.message}));
    }    
}

module.exports = {
    getAll, getRepo, addRepo, updRepo, delRepo
}