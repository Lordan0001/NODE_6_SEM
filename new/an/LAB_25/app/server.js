const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/db')
const authRoutes = require('./routes/auth');
const usersRoutes = require('./routes/users');
const reposRoutes = require('./routes/repos')
const checkRole = require('./middleware/checkRole');
const { User, Repo, Commit } = require('./models/models')
const { verifyToken, setUser } = require('./config/auth');

const app = express();

// /auth/register
// /auth/login




app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Проверка соединения с БД и синхронизация моделей
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
        return sequelize.sync();
    })
    .then(() => {
        console.log('All models were synchronized successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

app.use(setUser)
app.use(checkRole)
// Регистрация маршрутов
app.get('/api/ability', ((req, res) => {
    res.send(req.ability.rules);
}));
app.use('/auth', authRoutes);
app.use('/api/users', verifyToken, usersRoutes);

app.use('/api/repos', ((req, res, next) => {
    console.log(req.ability.rules);
    if (req.ability.can('read', 'Repos')) {
        next()
    } else {
        console.log('okay')
        return res.status(403).send({ message: 'You are not allowed to do this!' })
    }
}), reposRoutes);

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal server error');
});

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
