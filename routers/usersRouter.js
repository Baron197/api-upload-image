const express = require('express')
const { usersController } = require('../controllers')

const router = express.Router()

router.post('/register', usersController.register)
router.put('/verifikasiemail', usersController.emailVerifikasi)

module.exports = router