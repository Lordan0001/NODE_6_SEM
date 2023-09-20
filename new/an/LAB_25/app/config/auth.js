const jwt = require('jsonwebtoken');

const jwtSecret = 'VladJwt'

function generateAccessToken(user) {
  console.log('here')
  console.log(user)
  return jwt.sign(user, jwtSecret, { expiresIn: '30m' });
}

function setUser(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  const token = authHeader;
  if (!token) {
    console.log('guest without token');
    req.user = { role: 'guest' };
  }

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      console.log('guest with token');
      req.user = { role: 'guest' };
    } else {
      req.user = user;
    }
    next();
  });
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader;
  if (!token) return res.status(401).send('Access denied');

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) return res.status(403).send('Invalid token');
    req.user = user;
    next();
  });
}

module.exports = { generateAccessToken, verifyToken, setUser };
