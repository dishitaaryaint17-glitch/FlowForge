const { body } = require("express-validator");

const signupValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(["admin", "member"])
    .withMessage("Invalid role"),
];

const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Enter a valid email address"),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

module.exports = {
  signupValidator,
  loginValidator,
};