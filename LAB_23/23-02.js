const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const redis = require('redis');
const { promisify } = require('util');

const redisClient = redis.createClient({
  url:'connection string'
});
//аксес и рефреш блэк лист

redisClient.on('error', (error) => {
  console.error('Redis error:', error);
});

redisClient.on('connect', () => {
  console.log('Redis connected');
});

if (!redisClient.connected) {
  redisClient.connect();
}

async function addToBlacklist(token) {
  redisClient.set(`blacklist_${token}`, 'true', 'EX', 24 * 60 * 60)
}

async function isBlacklisted(token) {
  var token = await redisClient.get(`blacklist_${token}`)
  console.log(token);
  if (token != null) {
    console.log('true');
    return true;
  }
  else {
    console.log('false');
    return false;
  }
}

// Инициализируем приложение
const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Устанавливаем соединение с базой данных
const sequelize = new Sequelize('lab_23', 'root', 'pass', {
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

// Определяем модель пользователя
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Синхронизируем модель с базой данных
sequelize.sync()
  .then(() => {
    console.log('Database synced');
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });

// Задаем секретный ключ для подписи токенов
const jwtSecret = 'secret';
const refreshjwtSecret = 'refresh_secret';

// Обработчик GET-запроса на /login
app.get('/auth/login', (req, res) => {
  res.send(`
    <h1>Login</h1>
    <form method="post" action="/auth/login">
      <div>
        <label>Username:</label>
        <input type="text" name="username" />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" name="password" />
      </div>
      <div>
        <button type="submit">Login</button>
      </div>
    </form>
  `);
});

app.post('/auth/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username, password } });

  if (!user) {
    res.redirect('/auth/login');
    return;
  }

  // Генерируем access- и refresh-токены
  const accessToken = jwt.sign({ username }, jwtSecret, { expiresIn: '10m' });
  const refreshToken = jwt.sign({ username }, refreshjwtSecret, { expiresIn: '24h' });

  res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict' });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', path: '/auth' });
  // Отправляем пару токенов на клиент
  res.json({ accessToken, refreshToken });
});

// Обработчик GET-запроса на /refresh-token
app.get('/auth/refresh-token', async (req, res) => {
  const refreshToken = req.cookies['refreshToken'];
  try {
    if (await isBlacklisted(refreshToken)) {
      res.status(401).send('Token black list')
      return;
    }
    // Проверяем валидность refresh-токена
    const decoded = jwt.verify(refreshToken, refreshjwtSecret);

    // Генерируем новую пару access- и refresh-токенов
    const accessToken = jwt.sign({ username: decoded.username }, jwtSecret, { expiresIn: '10m' });
    const newRefreshToken = jwt.sign({ username: decoded.username }, refreshjwtSecret, { expiresIn: '24h' });
    addToBlacklist(refreshToken)
    res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict' });
    res.cookie('refreshToken', newRefreshToken, { httpOnly: true, sameSite: 'strict', path: '/auth'  });
    // Отправляем новую пару токенов на клиент
    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    console.log(error);
    // Если токен не валидный, возвращаем статус 401
    res.status(401).send('Invalid token');
  }
});
//auht
// Обработчик GET-запроса на /logout
app.get('/auth/logout', (req, res) => {
  res.clearCookie('accessToken')
  res.clearCookie('refreshToken', { path: '/auth' })
  res.send('Logged out');
});

// Обработчик GET-запроса на /register
app.get('/auth/register', (req, res) => {
  res.send(`
      <h1>Register</h1>
      <form method="post" action="/auth/register">
        <div>
          <label>Username:</label>
          <input type="text" name="username" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" />
        </div>
        <div>
          <button type="submit">Register</button>
        </div>
      </form>
    `);
});

// Обработчик POST-запроса на /register
app.post('/auth/register', async (req, res) => {
  const { username, password } = req.body;

  // Проверяем, что оба поля заполнены
  if (!username || !password) {
    res.status(400).send('Username and password are required');
    return;
  }

  // Проверяем, что пользователь с таким именем не существует
  const existingUser = await User.findOne({ where: { username } });

  if (existingUser) {
    res.status(409).send('User with this username already exists');
    return;
  }

  // Создаем нового пользователя
  const newUser = await User.create({ username, password });

  // Генерируем access- и refresh-токены
  const accessToken = jwt.sign({ username }, jwtSecret, { expiresIn: '10m' });
  const refreshToken = jwt.sign({ username }, refreshjwtSecret, { expiresIn: '24h' });

  res.cookie('accessToken', accessToken, { httpOnly: true, sameSite: 'strict' });
  res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict', path: '/auth' });

  // Отправляем пару токенов на клиент
  res.json({ accessToken, refreshToken });
});
// Обработчик GET-запроса на /resource
app.get('/auth/resource', async (req, res) => {
  const authHeader = req.headers.authorization;
  const authCookie = req.cookies['accessToken']
  if (!authHeader && !authCookie) {
    // Если нет заголовка авторизации, возвращаем ошибку 401
    res.status(401).send('Unauthorized');
    return;
  }

  let token
  if (authCookie) {
    token = authCookie;
  }

  try {
    // Проверяем валидность токена
    const decoded = jwt.verify(token, jwtSecret);
    res.send(`Welcome, ${decoded.username}!`);
  } catch (error) {
    // Если токен не валидный, возвращаем ошибку 401
    res.status(401).send('Invalid token');
  }
});

// Обработчик для всех остальных URI
app.use((req, res) => {
  res.status(404).send('Not found');
});

// Запускаем сервер
app.listen(3000, () => {
  console.log('Server started on http://localhost:3000');
});