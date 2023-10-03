const express = require('express');
const passport = require('passport');
const session = require('express-session');
const app = express();
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const GOOGLE_CLIENT_ID = 'GOOGLE_CLIENT_ID'
const GOOGLE_CLIENT_SECRET = 'GOOGLE_CLIENT_SECRET'

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
},
  function (accessToken, refreshToken, profile, done) {
    console.log(profile);
    return done(null, {
      displayName: profile.displayName,
      id: profile.id
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

app.use(session({
  secret: 'my_secret_key', // секретный ключ для подписи куки
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize()); // инициализация Passport
app.use(passport.session()); // настройка сессий для Passport


app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'], prompt: 'consent' }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/resource');
  });


app.get('/login', (req, res) => {
  res.send(`<html>
    <body>
      <a href="/auth/google">Аутентификация через Google</a>
    </body>
  </html>`);
});

app.get('/logout', (req, res) => {
  req.logout(x => x);
  res.redirect('/login');
});

app.get('/resource', isLoggedIn, (req, res) => {
  const user = req.user;
  res.send(`<html>
    <body>
      <h1>RESOURCE</h1>
      <p>Добро пожаловать, ${user.displayName}!</p>
      <p>ID: ${user.id}</p>
      <a href="/logout">Выйти</a>
    </body>
  </html>`);
});

app.use((req, res) => {
  res.status(404).send('Страница не найдена');
});

app.listen(3000, function () {
  console.log('Server started on port 3000');
});

