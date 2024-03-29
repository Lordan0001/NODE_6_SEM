import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';
import User from "../models/User.js";

export const register = async (req, res) => {
  try {
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};

export const Subscribe = async (req, res) => {
  try {
    const ownerId = req.body.ownerId;
    const subToId = req.body.subToId;

    const user = await UserModel.findById(ownerId);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    const exists = user.subscribedTo.includes(subToId);

    if (!exists) {
      user.subscribedTo.addToSet(subToId);
      await user.save();
    }
    if(exists){
      user.subscribedTo.remove(subToId);
      await user.save();
      return     res.status(200).json({
        message: 'Отписался',
      });
    }

    res.status(200).json({
      message: 'Подписался',
    });
  } catch (err) {
    res.status(500).json({
      message: 'Не подписался',
    });
  }
};

export const getSubscribersFromUser = async (req, res) => {
  const ownerId = req.params.id;
  try {
    const user = await UserModel.findById(ownerId);
    res.json(user.subscribedTo);
  } catch (err) {
    res.status(500).json({
      message: 'Failed to retrieve the list of subscribed users.',
    });
  }
};