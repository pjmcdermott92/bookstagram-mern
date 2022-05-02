const Post = require('../models/Post');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const { generateUploadUrl, deleteObject } = require('../utils/s3');

// @route   GET /api/v1/posts
// @desc    Get All Posts
// @access  Private
exports.getPosts = asyncHandler(async (req, res) => {
    const query = Post.find({ 'title': new RegExp(req.query.query, 'i') }).sort({ 'createdAt': -1 })
    const posts = await query;
    res.json({ success: true, data: posts });
});

// @route   GET /api/v1/posts/upload/get-url
// @desc    Get Upload URL
// @access  Private
exports.getUploadUrl = asyncHandler(async (req, res) => {
    const uploadUrl = await generateUploadUrl();
    const imageUrl = uploadUrl.split('?')[0];

    res.json({ success: true, data: { uploadUrl, imageUrl }});
});

// @route   POST /api/v1/posts/upload
// @desc    Save uploaded file info to database
// @access  Private
exports.savePost = asyncHandler(async (req, res) => {
    const { title, imageUrl } = req.body;
    const { _id, firstName, lastName, avatar } = req.user;
    const post = await Post.create({
        user: _id, firstName, lastName, avatar, title, imageUrl
    });

    return res.status(201).json({ success: true, data: post });
});

// @route   PUT /api/v1/posts/like/:id
// @desc    Like a post
// @access  Private
exports.likePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    
    if (post.likes.some(like => like.user.toString() === req.user.id))
        return next(new ErrorResponse('Post already liked', 400));

    post.likes.unshift({ user: req.user.id });
    await post.save();
    return res.json({ success: true, data: post });
});

// @route   PUT /api/v1/posts/unlike/:id
// @desc    Unlike a post
// @access  Private
exports.unlikePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post.likes.some(like => like.user.toString() === req.user.id))
        return next(new ErrorResponse('Post not yet liked', 400));

    post.likes = post.likes.filter(({ user }) => user.toString() !== req.user.id);
    await post.save();
    return res.json({ success: true, data: post });
});

// @route   DELETE /api/v1/posts/:id
// @desc    Delete a post
// @access  Private
exports.deletePost = asyncHandler(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (post.user.toString() !== req.user.id)
        return next(new ErrorResponse('You are not authorized to delete this post', 403));

    const fileKey = post.imageUrl.split('/')[3];
    await deleteObject(fileKey);

    await post.remove();
    return res.json({ success: true });
});
