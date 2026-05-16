const User = require("../models/User");
const generateToken = require("../utils/generateToken");

const {
  successResponse,
  errorResponse,
} = require("../utils/responseHandler");


// SIGNUP
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    console.log("Signup Request Body:", req.body);

    // Check existing user
    const existing = await User.findOne({ email });

    if (existing) {
      return errorResponse(
        res,
        "Email already in use",
        400
      );
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    console.log("User Created:", user);

    // Generate token
    const token = generateToken(user._id);

    return successResponse(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      },
      201
    );

  } catch (err) {
    console.error("SIGNUP ERROR:", err);

    return errorResponse(
      res,
      err.message || "Server Error",
      500
    );
  }
};


// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("Login Request:", req.body);

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(
        res,
        "User not found",
        401
      );
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return errorResponse(
        res,
        "Incorrect password",
        401
      );
    }

    const token = generateToken(user._id);

    return successResponse(
      res,
      {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token,
      }
    );

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return errorResponse(
      res,
      err.message || "Server Error",
      500
    );
  }
};


// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password");

    if (!user) {
      return errorResponse(
        res,
        "User not found",
        404
      );
    }

    return successResponse(
      res,
      { user }
    );

  } catch (err) {
    console.error("PROFILE ERROR:", err);

    return errorResponse(
      res,
      err.message || "Server Error",
      500
    );
  }
};