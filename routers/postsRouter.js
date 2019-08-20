const express = require('express')
const { postsController } = require('../controllers')
const { auth } = require('../helpers/auth');

const router = express.Router()

router.get('/getposts', auth, postsController.getPosts)
router.post('/addpost', auth, postsController.addPost)
router.delete('/deletepost/:id', auth, postsController.deletePost)
router.put('/editpost/:id', auth, postsController.editPost)

module.exports = router