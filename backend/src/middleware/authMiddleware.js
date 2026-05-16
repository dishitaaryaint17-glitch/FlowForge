const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { errorResponse } = require('../utils/responseHandler');

const protect = async (req, res, next) => {
  let token;
  try {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (!user) return errorResponse(res, 'Not authorized, user not found', 401);
      req.user = { id: user._id.toString(), role: user.role };
      return next();
    }

    return errorResponse(res, 'Not authorized, token missing', 401);
  } catch (err) {
    return errorResponse(res, 'Not authorized, token invalid', 401);
  }
};

module.exports = protect;
