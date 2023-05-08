import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import {registerValidation} from './validations/auth.js'
import {validationResult} from 'express-validator'
import UserModel from './models/Users.js'

const app = express();
mongoose.connect(
    'mongodb+srv://admin:admin@cluster0.klivmmt.mongodb.net/blog?retryWrites=true&w=majority',
).then(() => console.log('connected to Mongo')
).catch((err) => console.log('DB error', err));

//use
app.use(express.json());

//route
app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.post('/auth/register', registerValidation, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash,
            avatarUrl: req.body.avatarUrl,

        });
        const user = await doc.save();

        res.json(user)
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'registration failed'
        })
    }
})


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Server is started at 4444 port')
})