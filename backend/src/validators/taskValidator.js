const { body } = require('express-validator');
const { TASK_STATUS, TASK_PRIORITY } = require('../utils/constants');

exports.taskValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('project').optional().isMongoId().withMessage('project must be a valid id'),
  body('assignedTo').optional().isMongoId().withMessage('assignedTo must be a valid user id'),
  body('status').optional().isIn(TASK_STATUS).withMessage('Invalid status'),
  body('priority').optional().isIn(TASK_PRIORITY).withMessage('Invalid priority'),
];
