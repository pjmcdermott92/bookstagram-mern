const User = require('../models/User');
const normailize = require('normalize-url');
const gravatar = require('gravatar');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const sendTokenResponse = require('../utils/sendTokenResponse');

// @route   POST /api/v1/users/register
// @desc    Register a new User
// @access  Public
exports.registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    const avatar = normailize(gravatar.url(
        email, { s: 200, r: 'pg', d: 'mm' }), { forceHttps: true }
    );

    const user = await User.create({
        firstName, lastName, email: email.toLowerCase(), password, avatar
    });
    sendTokenResponse(user, 201, res);
});

// @route   POST /api/v1/users
// @desc    Login User
// @access  Public
exports.loginUser = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide an Email Address and Password', 400));
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) return next(new ErrorResponse('Invalid Credentials', 401));
    const isMatch = await user.comparePassword(password);
    if (!isMatch) return next(new ErrorResponse('Invalid Credentials', 401));

    sendTokenResponse(user, 200, res);
});

// @route   GET /api/v1/users/logout
// @desc    Log out user
// @access  Public
exports.logout = asyncHandler(async (req, res) => {
    console.log(res);
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 1 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, data: {} });
})

// @route   GET /api/v1/users
// @desc    Get current user
// @access  Private
exports.getUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    res.status(200).json({ success: true, data: user });
});
