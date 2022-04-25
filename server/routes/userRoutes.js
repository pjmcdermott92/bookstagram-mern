const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { registerUser, loginUser, logout, getUser } = require('../controllers/userControllers');

router.get('/', protect, getUser);
router.get('/logout', logout);
router.post('/', loginUser);
router.post('/register', registerUser);

module.exports = router;
