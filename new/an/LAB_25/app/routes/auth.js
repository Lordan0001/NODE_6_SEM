const router = require('express').Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');

const { User } = require('../models/models')
const { checkRole } = require('../middleware/checkRole');
const jwtSecret = 'AndreyJwt'

router.get('/register', (req, res) => {
  res.send(`
        <h1>Register</h1>
        <form method="post" action="/auth/register">
          <div>
            <label>Email:</label>
            <input type="text" name="email" />
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

router.post('/register', async (req, res) => {
  try {
    console.log(req.body);
    const { email, password } = req.body;
    const user = await User.create({ email, password, role: 'registered' });
    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret);
    res.send({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

router.get('/login', (req, res) => {
  res.send(`
      <h1>Login</h1>
      <form method="post" action="/auth/login">
        <div>
          <label>Email:</label>
          <input type="text" name="email" />
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

router.post('/login', async (req, res) => {
  try {
    console.log(req);
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).send('Invalid email or password');
    }

    const isValidPassword = await user.validPassword(password);
    if (!isValidPassword) {
      return res.status(400).send('Invalid email or password');
    }

    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret);
    res.send({ user, token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});

// Обработчик GET-запроса на /logout
router.get('/logout', (req, res) => {
  res.clearCookie('accessToken')
  res.send('Logged out');
});

module.exports = router;
