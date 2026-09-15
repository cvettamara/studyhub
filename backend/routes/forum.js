const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getPosts,
  createPost,
  searchPosts,
  getAnswers,
  createAnswer,
  likePost,
  unlikePost,
  deletePost,
  getAiSuggestion,
  getAiPreview

} = require('../controllers/forumController');

router.get('/posts', auth, getPosts);
router.post('/posts', auth, createPost);
router.post('/posts/ai-preview', auth, getAiPreview);
router.get('/posts/search', auth, searchPosts);
router.get('/posts/:id/answers', auth, getAnswers);
router.post('/posts/:id/answers', auth, createAnswer);
router.post('/posts/:id/like', auth, likePost);
router.delete('/posts/:id', auth, deletePost);
router.delete('/posts/:id/like', auth, unlikePost);
router.post('/posts/:id/ai-suggest', auth, getAiSuggestion);

module.exports = router;