const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getPosts,
  createPost,
  getAnswers,
  createAnswer,
  likePost
} = require('../controllers/forumController');

router.get('/posts', auth, getPosts);
router.post('/posts', auth, createPost);
router.get('/posts/:id/answers', auth, getAnswers);
router.post('/posts/:id/answers', auth, createAnswer);
router.post('/posts/:id/like', auth, likePost);

module.exports = router;