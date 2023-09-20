const express = require('express')
const AuthController = require('../controllers/auth')

let router = express.Router()

router.get('/login', AuthController.getLogin)
router.get('/register', AuthController.getRegister)
router.get('/logout', AuthController.getLogout)
router.post('/login', AuthController.postLogin)
router.post('/register', AuthController.postRegister)

module.exports = router