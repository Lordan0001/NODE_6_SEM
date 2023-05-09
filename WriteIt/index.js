import express from 'express';
import mongoose from 'mongoose';
import {registerValidation, loginValidation, postCreateValidation} from './validations.js'
import checkAuth from './utils/checkAuth.js'
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

const app = express();
mongoose.connect(
    'mongodb+srv://admin:admin@cluster0.klivmmt.mongodb.net/blog?retryWrites=true&w=majority',
).then(() => console.log('connected to Mongo')
).catch((err) => console.log('DB error', err));

//use
app.use(express.json());

//ROUTES
//users
app.post('/auth/register', registerValidation, UserController.register)
app.post('/auth/login', loginValidation, UserController.login);
app.get('/auth/me', checkAuth, UserController.getMe);
//posts
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts',checkAuth, postCreateValidation, PostController.create);
//app.delete('/posts', PostController.remove);
//app.patch('/posts', PostController.update);//patch - частичное обновление

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server is started at 4444 port')
})