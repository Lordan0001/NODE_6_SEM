const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

//сериализация десириализация
const users = require('./users.json');

const app = express();

app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//const user = users.users.find(u => u.username == 'root' && u.password == 'root')
//console.log(user);
passport.use(new LocalStrategy(
    (username, password, done) => {
        const user = users.users.find(u => u.username == username && u.password == password)
        if (user != undefined) {
            return done(null, { id: user.id, username: user.username });
        } else {
            // иначе возвращаем ошибку аутентификации
            return done(null, false, { message: 'Incorrect username or password' });
        }
    }
));

passport.serializeUser((user, done) => {
    console.log('serializeUser');
    console.log(user);
    console.log('---------------');
    done(null, { id: user.id, username: user.username });
});

passport.deserializeUser((userHandler, done) => {
    console.log('deserializeUser');
    console.log(userHandler);
    console.log('---------------');
    const user = users.users.find(u => u.id === userHandler.id);
    if (user) {
        done(null, user);
    } else {
        done(new Error('User not found'));
    }
});

app.get('/login', (req, res) => {
    res.send(`
      <form method="post" action="/login">
        <div>
          <label>Username:</label>
          <input type="text" name="username" required>
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" required>
        </div>
        <div>
          <input type="submit" value="Log In">
        </div>
      </form>
    `);
});

app.post('/login',
    passport.authenticate('local', { failureRedirect: '/login' }),
    (req, res) => {
        // res.cookie('sessionId', req.sessionID);
        res.redirect('/resource');
    }
);

app.get('/logout', (req, res) => {
    res.clearCookie('connect.sid');
    res.redirect('/login');
});

app.get('/resource', (req, res) => {
    try {
        if (!req.isAuthenticated()) {
            return res.status(401).send('Unauthorized');
        }

        try {
            res.send("hello")
        } catch (err) {
            res.status(401).send('Unauthorized');
        }
    }
    catch {
        res.status(401).send('Unauthorized');
    }
});

app.use((req, res) => {
    res.status(404).send('Not found');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});