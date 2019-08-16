const express = require('express')
const { usersController } = require('../controllers')

const router = express.Router()

router.post('/register', usersController.register)
router.put('/verifikasiemail', usersController.emailVerifikasi)
router.post('/resendemailver', usersController.resendEmailVer)
router.post('/keeplogin', usersController.keepLogin)
router.post('/login', usersController.login)

module.exports = router