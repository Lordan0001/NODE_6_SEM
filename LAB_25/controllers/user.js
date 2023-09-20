const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

class Users {
    constructor(id,username, email, role){
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }
}

const getAll = async (request, response) => {
    try{
        console.log(123321);    
        let users = await prisma.users.findMany({select:{
            id:true,
            username:true,
            email:true,
            role:true
        }})
        response.end(JSON.stringify(users));
    } catch(err){
        console.log(err.message);
        response.status(500).end(JSON.stringify({message:err.message}));
    }
}

const getUser = async (request, response) => {
    try{
        let user = await prisma.users.findFirst({
            where: {
                id: +request.params.id
            },
            select: {
                id:true,
                username:true,
                email:true,
                role:true
        }})
        
        request.ability.throwUnlessCan(
            "read",
            new Users(user.id, user.username, user.email, user.role)
            );
            
        response.end(JSON.stringify(user));
    } catch(err){
        console.log(err.message);
        response.status(500).end(JSON.stringify({message:err.message}));
    }    
}

const getAbility = async (request, response) => {
    return;
}

module.exports = {
    getAll, getUser, getAbility
}