const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const {login, regist, logout} = require('./controllers/auth');
const userRouter = require('./routers/user')
const reposRouter = require('./routers/repos')
const {auth} = require('./middleware/index')
app = express();

app.use(cookieParser('secret'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


app.get('/', (request, response)=>{
    response.end(fs.readFileSync('./public/index.html'));
});

app.get('/login', (request, response)=>{
    response.end(fs.readFileSync('./public/login.html'));
});

app.post('/login', login);

app.get('/register', (request, response)=>{
    response.end(fs.readFileSync('./public/regist.html'));
});

app.post('/register', regist);

// app.get('/manage', (request, response)=>{
//     response.end(fs.readFileSync('./public/manage.html'));
// });

// app.get('/repoPage', (req, res)=>{
//     res.end(fs.readFileSync('./public/repos.html'))
// });
// app.get('/repo/:id', (req, res)=>{
//     res.end(fs.readFileSync('./public/repo.html'))
// });


app.get("/api/ability", auth, (req, res) => {
    res.status(200).send(req.ability.rules);
});

app.get('/logout', logout)

app.use('/api/repos', reposRouter);
app.use('/api/users', userRouter);

app.listen(3000);