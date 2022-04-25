const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const checkObjectId = require('../middleware/checkObjectId');
const { getPosts, likePost, unlikePost, deletePost, getUploadUrl, savePost } = require('../controllers/postControllers');

router.get('/', protect, getPosts);
router.get('/upload/get-url', protect, getUploadUrl);
router.post('/upload', protect, savePost);
router.put('/like/:id', protect, checkObjectId('id'), likePost);
router.put('/unlike/:id', protect, checkObjectId('id'), unlikePost);
router.delete('/:id', protect, checkObjectId('id'), deletePost);

module.exports = router;
