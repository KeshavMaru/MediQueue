const { signup, login, logout } = require("../services/authService");

/**
 * Signup handler
 */
async function signupController(req, res) {
  try {
    const { email, password, full_name, user_type, doctor_details } = req.body;

    if (!email || !password || !full_name) {
      return res.status(400).json({ error: "Email, password, and full name are required" });
    }

    if (!user_type || !["doctor", "patient"].includes(user_type)) {
      return res.status(400).json({ error: "User type must be 'doctor' or 'patient'" });
    }

    // If doctor, validate doctor details
    if (user_type === "doctor") {
      if (!doctor_details || !doctor_details.specialization || doctor_details.experienceYears === undefined || 
          !doctor_details.dailyStartTime || !doctor_details.dailyEndTime || !doctor_details.slotDurationMinutes) {
        return res.status(400).json({ 
          error: "Doctor details required: specialization, experienceYears, dailyStartTime, dailyEndTime, slotDurationMinutes" 
        });
      }
    }

    const user = await signup(email, password, full_name, user_type, doctor_details);
    res.status(201).json({
      ok: true,
      body: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        user_type: user.user_type,
      },
    });
  } catch (error) {
    const statusCode = error.message.includes("already exists") ? 409 : 400;
    res.status(statusCode).json({ ok: false, error: error.message });
  }
}

/**
 * Login handler
 */
async function loginController(req, res) {
  try {
    const { email, password, user_type } = req.body;
    console.log('Auth login request body:', req.body);

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (user_type && !["doctor", "patient"].includes(user_type)) {
      return res.status(400).json({ error: "User type must be 'doctor' or 'patient'" });
    }

    const userAgent = req.get("user-agent") || "";
    const ipAddress = req.ip || "";

    const tokens = await login(email, password, user_type, userAgent, ipAddress);

    res.json({
      ok: true,
      body: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ ok: false, error: error.message });
  }
}

/**
 * Logout handler
 */
async function logoutController(req, res) {
  try {
    const { userId } = req.user || {};
    const { refreshToken } = req.body;

    if (!userId || !refreshToken) {
      return res.status(400).json({ error: "User ID and refresh token are required" });
    }

    await logout(userId, refreshToken);
    res.json({ ok: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({ ok: false, error: error.message });
  }
}

/**
 * Get current user (protected route)
 */
async function meController(req, res) {
  try {
    const { sub: userId } = req.user || {};
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { getUserById } = require("../services/authService");
    const user = await getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({
      ok: true,
      body: user,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
}

module.exports = {
  signupController,
  loginController,
  logoutController,
  meController,
};
