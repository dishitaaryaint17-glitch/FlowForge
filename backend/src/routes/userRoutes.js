const express = require('express');
const router = express.Router();
const { getUsers, getUserById, getMySettings, updateMySettings } = require('../controllers/userController');
const protect = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.get('/me/settings', protect, getMySettings);
router.put('/me/settings', protect, updateMySettings);
router.get('/', protect, authorizeRoles('admin'), getUsers);
router.get('/:id', protect, authorizeRoles('admin'), getUserById);

module.exports = router;
