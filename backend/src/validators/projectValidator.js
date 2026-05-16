const { body } = require('express-validator');

exports.projectValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('members').optional().isArray().withMessage('Members must be an array of user IDs'),
  body('dueDate').optional({ checkFalsy: true }).isISO8601().withMessage('Due date must be a valid date'),
];
