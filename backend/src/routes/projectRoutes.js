const express = require('express');
const router = express.Router();
const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const protect = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { projectValidator } = require('../validators/projectValidator');

router.route('/').post(protect, authorizeRoles('admin'), projectValidator, validate, createProject).get(protect, getProjects);
router.route('/:id').get(protect, getProjectById).put(protect, authorizeRoles('admin'), projectValidator, validate, updateProject).delete(protect, authorizeRoles('admin'), deleteProject);

module.exports = router;
