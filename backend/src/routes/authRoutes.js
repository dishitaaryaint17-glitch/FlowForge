const express = require('express');
const router = express.Router();
const { signup, login, getProfile } = require('../controllers/authController');
const validate = require('../middleware/validateMiddleware');
const { signupValidator, loginValidator } = require('../validators/authValidator');
const protect = require('../middleware/authMiddleware');

router.post('/signup', signupValidator, validate, signup);
router.post('/login', loginValidator, validate, login);
router.get('/profile', protect, getProfile);

module.exports = router;
