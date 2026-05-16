const User = require('../models/User');
const { successResponse, errorResponse } = require('../utils/responseHandler');


exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    successResponse(res, { users });
  } catch (err) {
    errorResponse(res, err.message || 'Server Error', 500);
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return errorResponse(res, 'User not found', 404);
    successResponse(res, { user });
  } catch (err) {
    errorResponse(res, err.message || 'Server Error', 500);
  }
};

exports.getMySettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('settings name email role');
    if (!user) return errorResponse(res, 'User not found', 404);

    successResponse(res, {
      settings: {
        workspaceName: user.settings?.workspaceName || 'FlowForge Team Space',
        emailNotifications: user.settings?.emailNotifications ?? true,
        taskDigest: user.settings?.taskDigest ?? true,
        compactMode: user.settings?.compactMode ?? false,
      },
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    errorResponse(res, err.message || 'Server Error', 500);
  }
};

exports.updateMySettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return errorResponse(res, 'User not found', 404);

    const {
      workspaceName,
      emailNotifications,
      taskDigest,
      compactMode,
    } = req.body;

    user.settings = {
      ...(user.settings || {}),
      ...(workspaceName !== undefined ? { workspaceName } : {}),
      ...(emailNotifications !== undefined ? { emailNotifications } : {}),
      ...(taskDigest !== undefined ? { taskDigest } : {}),
      ...(compactMode !== undefined ? { compactMode } : {}),
    };

    await user.save();

    successResponse(res, {
      settings: user.settings,
    });
  } catch (err) {
    errorResponse(res, err.message || 'Server Error', 500);
  }
};
