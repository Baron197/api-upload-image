const express = require('express')
const { postsController } = require('../controllers')

const router = express.Router()

router.get('/getposts', postsController.getPosts)
router.post('/addpost', postsController.addPost)

module.exports = router