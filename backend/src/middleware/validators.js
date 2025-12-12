const { body, validationResult } = require("express-validator");

/**
 * Validate signup input
 */
const validateSignup = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("full_name").trim().notEmpty().withMessage("Full name is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validation error", details: errors.array() });
    }
    next();
  },
];

/**
 * Validate login input
 */
const validateLogin = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: "Validation error", details: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateSignup,
  validateLogin,
};
