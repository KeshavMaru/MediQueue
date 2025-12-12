const express = require("express");
const router = express.Router();
const { signupController, loginController, logoutController, meController } = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");
const { validateSignup, validateLogin } = require("../middleware/validators");

/**
 * Auth routes
 */

// POST /auth/signup - Create new user
router.post("/signup", validateSignup, signupController);

// POST /auth/login - Authenticate user
router.post("/login", validateLogin, loginController);

// POST /auth/logout - Logout user (protected)
router.post("/logout", requireAuth, logoutController);

// GET /auth/me - Get current user (protected)
router.get("/me", requireAuth, meController);

module.exports = router;
