import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import {registerValidation, loginValidation, postCreateValidation} from './validations.js'
import {handleValidationErrors, checkAuth} from './utils/index.js';
import {UserController,PostController} from "./controllers/index.js";

const app = express();
mongoose.connect(
    'mongodb+srv://admin:admin@cluster0.klivmmt.mongodb.net/blog?retryWrites=true&w=majority',
).then(() => console.log('connected to Mongo')
).catch((err) => console.log('DB error', err));

//use
app.use(express.json());
app.use('/uploads', express.static('uploads'));

//storage
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({storage});

//ROUTES

app.get('/auth/me', checkAuth, UserController.getMe);
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);

app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)//валидация -> возвращвем массив ошибок -> регистрация
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/posts', checkAuth, postCreateValidation,handleValidationErrors, PostController.create);
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({url: `/uploads/${req.file.originalname}`,});
});

app.delete('/posts/:id', checkAuth, PostController.remove);

app.patch('/posts/:id', checkAuth, postCreateValidation,handleValidationErrors, PostController.update);//patch - частичное обновление

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server is started at 4444 port')
})