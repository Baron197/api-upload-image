const express = require('express')
const { usersController } = require('../controllers')
const { auth } = require('../helpers/auth');

const router = express.Router()

router.post('/register', usersController.register)
router.put('/verifikasiemail', usersController.emailVerifikasi)
router.post('/resendemailver', usersController.resendEmailVer)
router.post('/keeplogin', auth, usersController.keepLogin)
router.post('/login', usersController.login)

module.exports = router