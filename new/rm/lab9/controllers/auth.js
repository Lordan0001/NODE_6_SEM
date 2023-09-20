const { json, request, response } = require('express');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

function generateAccessToken(user){
    return jwt.sign(user, 'secretAccess', {expiresIn:'30m'});
}

function generateRefreshToken(user){
    return jwt.sign(user, 'secretRefresh', {expiresIn:'20m'});
}

class users {
    constructor(id,username, email, role){
        this.id = id;
        this.username = username;
        this.email = email;
        this.role = role;
    }
}

const login = async (request, response) => {
    try{
        let {email, password} = request.body;
        let user = await prisma.users.findFirst({where:{email: email}});
        if(!user)response.status(500).end(JSON.stringify({message:'User not found'}));
        if(user.password != password)response.status(500).end(JSON.stringify({message:'wrong password'}));
        let accessToken = generateAccessToken({email: user.email, id: user.id, role: user.role});
        let refreshToken = generateRefreshToken({email: user.email, id: user.id, role: user.role});
        console.log(accessToken);
        response.cookie('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'strict'
        });
        response.cookie('refreshToken', refreshToken, {
            httpOnly: true,//по защищ соед. Не дает получить доступ к куки через document.cookie
            sameSite: 'strict', //отправляются сайту которому пренадежат
            path: '/refresh-token'// запрос должен содержать заголовок куки только если есть указанный URL в запрашиваемом ресурсе
        });
        response.redirect('/manage');

    } catch(err){
        console.log(err.message);
        response.status(500).end(JSON.stringify({message:err.message}));
    }
}

const regist = async (request, response) => {
    try{
        console.log(request.body);
        let {username, email, password} = request.body;
        let user = await prisma.users.findFirst({where:{email:email}});
        if(user) response.status(500).end(JSON.stringify({message:'user already exist'}));
        await prisma.users.create({
            data: {
                username,
                email,
                password,
                role: 'user'
            }
        });
        response.redirect('/login');
    }catch(err){
        console.log(err.message);
        response.status(500).end(JSON.stringify({message:err.message}));
    }
}

const logout = async (request, response)=>{
    try{
        console.log(request.cookies);

        // let accept = await client.get(request.cookies['refreshToken']);
        // if(!accept){
        //     refreshsTokens[request.cookies['refreshToken']] = 1;
        //     await client.set(request.cookies['refreshToken'], 1);
        // }
        response.clearCookie('accessToken');
        response.clearCookie('refreshToken', {path: '/refresh-token'});
        // response.clearCookie('refreshToken', {path: '/logout'});
        response.redirect('/login');
    } catch(err){
        console.log(err.message);
        response.status(401).json({message:"logout error"});
    }
}

module.exports = {
    login, regist, logout
}