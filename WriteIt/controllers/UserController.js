import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        }
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash: hash,
            avatarUrl: req.body.avatarUrl,

        });
        const user = await doc.save();
        const token = jwt.sign({
                _id: user._id,
            }, 'secret123',
            {
                expiresIn: '90d',
            });

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData, token//overriding user
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'registration failed'
        })
    }
}


export const login =async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});
        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        const isPassValid = await bcrypt.compare(req.body.password, user._doc.passwordHash);//походу сделает хеш из полученного и сравнит с хешем из базы
        if (!isPassValid) {
            return res.status(400).json({message: 'Invalid password'});
        }
        const token = jwt.sign({
                _id: user._id,
            }, 'secret123',
            {
                expiresIn: '90d',
            });

        const {passwordHash, ...userData} = user._doc;

        res.json({
            ...userData, token//overriding user
        });


    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'authorization failed'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        const {passwordHash, ...userData} = user._doc;

        res.json({userData});
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'My authorization failed'
        })

    }
}