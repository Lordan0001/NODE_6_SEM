const router = require('express').Router();
const { Op } = require('sequelize');

const { User } = require('../models/models')
const checkRole = require('../middleware/checkRole');
const { verifyToken } = require('../config/auth');

router.get('/', verifyToken, checkRole, async (req, res) => {
    if (!req.ability.can('read', await User.findAll({attributes: {exclude: ['password']}}))) {
        res.status(403).send({message: 'You are not allowed to do this!'})
    }
    else {
    try {
        const users = await User.findAll({attributes: {exclude: ['password']}});
        res.send(users);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
    }
});

router.get('/:id', verifyToken, checkRole, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, { attributes: { exclude: ['password'] } });
        if (!req.ability.can('read', user)) {
            return res.status(403).send({ message: 'You are not allowed to do this!' })
        }
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.put('/:id', verifyToken, checkRole, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }

        const { email, password, role } = req.body;
        user.email = email || user.email;
        user.password = password || user.password;
        user.role = role || user.role;

        await user.save();

        res.send(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.delete('/:id', verifyToken, checkRole, async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        await user.destroy();
        res.send('User deleted');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

module.exports = router;
