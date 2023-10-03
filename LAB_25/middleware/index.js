const jwt = require("jsonwebtoken");
const { Ability, AbilityBuilder } = require("casl");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient()

const auth = async (request, response, next)=>{
    try{
        const { rules, can } = AbilityBuilder.extract();
        let token = request.cookies['accessToken'];
        console.log(token);
        if(!token){
            console.log('non auth')
            can("read", ["Repos", "Commits"], {authorId: 0});
            request.ability = new Ability(rules);
            return next();
        }
        let decode = jwt.verify(token, 'secretAccess');
        console.log(decode);
        request.user = {
            email: decode.email,
            id: decode.id,
            role: decode.role
        }
        if(decode.role == 'admin'){
            can(["read", "create", "update"], ["Repos", "Commits"], {
                authorId: decode.id,
              });
            can("read", "Users", { id: decode.id });
            can("manage", "all");
        } else if(decode.role = 'user'){
            can(["read", "create", "update"], ["Repos", "Commits"], {
                authorId: decode.id,
            });
            can("read", "Users", {id: decode.id});
        }
        request.ability = new Ability(rules);
        next();
    } catch(err){
        console.log('error', err.message);
        response.status(500).end(JSON.stringify({message:'auth error'}));
    }
}

module.exports = {
    auth
}
