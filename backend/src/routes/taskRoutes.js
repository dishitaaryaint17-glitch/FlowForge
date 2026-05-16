const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');
const protect = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { taskValidator } = require('../validators/taskValidator');

router.route('/').post(protect, authorizeRoles('admin'), taskValidator, validate, createTask).get(protect, getTasks);
router.route('/:id').get(protect, getTaskById).put(protect, updateTask).delete(protect, authorizeRoles('admin'), deleteTask);

module.exports = router;
