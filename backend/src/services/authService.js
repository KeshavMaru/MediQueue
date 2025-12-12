const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const db = require("../db");
const slotService = require('./slotService');

const JWT_SECRET = process.env.JWT_SECRET || "change_me_in_production";
const JWT_EXPIRE = "15m";
const REFRESH_TOKEN_EXPIRE = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Hash password using bcrypt
 */
async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

/**
 * Compare plain password with hash
 */
async function verifyPassword(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash);
}

/**
 * Create JWT access token
 */
function createAccessToken(userId, role) {
  return jwt.sign({ sub: userId, role }, JWT_SECRET, { expiresIn: JWT_EXPIRE });
}

/**
 * Create refresh token (random string)
 */
function createRefreshToken() {
  return require("crypto").randomBytes(48).toString("hex");
}

/**
 * Verify JWT access token
 */
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

/**
 * Signup: create new user
 */
async function signup(email, password, fullName, userType = "patient", doctorDetails = null) {
  // Validate input
  if (!email || !password || !fullName) {
    throw new Error("Email, password, and full name are required");
  }

  if (!["doctor", "patient"].includes(userType)) {
    throw new Error("User type must be 'doctor' or 'patient'");
  }

  // If doctor, validate doctor details
  if (userType === "doctor") {
    if (!doctorDetails || !doctorDetails.specialization || !doctorDetails.experienceYears === undefined || !doctorDetails.dailyStartTime || !doctorDetails.dailyEndTime || !doctorDetails.slotDurationMinutes) {
      throw new Error("Doctor details required: specialization, experienceYears, dailyStartTime, dailyEndTime, slotDurationMinutes");
    }
  }

  // Check if user already exists
  const existing = await db.query("SELECT id FROM users WHERE email = $1", [email]);
  if (existing.rowCount > 0) {
    throw new Error("User already exists");
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Insert user
  const userId = uuidv4();
  const result = await db.query(
    "INSERT INTO users (id, email, password_hash, full_name, role, user_type) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email, full_name, role, user_type",
    [userId, email, passwordHash, fullName, userType === "doctor" ? "admin" : "user", userType]
  );

  // If doctor, insert doctor details
  if (userType === "doctor" && doctorDetails) {
    const doctorInsert = await db.query(
      "INSERT INTO doctors (user_id, name, specialization, experience_years, daily_start_time, daily_end_time, slot_duration_minutes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
      [userId, fullName, doctorDetails.specialization, doctorDetails.experienceYears, doctorDetails.dailyStartTime, doctorDetails.dailyEndTime, doctorDetails.slotDurationMinutes]
    );
    // Auto-generate slots for the newly registered doctor (non-blocking)
    try {
      const createdDoctorId = doctorInsert.rows[0].id;
      // Generate slots asynchronously but don't block signup response
      slotService.generateSlotsForDoctor(createdDoctorId).catch((e) => console.error('slot generation error', e));
    } catch (e) {
      console.error('failed to auto-generate slots for doctor', e);
    }
  }

  return result.rows[0];
}

/**
 * Login: authenticate user and create tokens
 */
async function login(email, password, userType = null, userAgent = "", ipAddress = "") {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Find user by email and optionally filter by user_type
  let query = "SELECT id, password_hash, role, user_type FROM users WHERE email = $1 AND is_active = true";
  const params = [email];

  if (userType) {
    if (!["doctor", "patient"].includes(userType)) {
      throw new Error("User type must be 'doctor' or 'patient'");
    }
    query += " AND user_type = $2";
    params.push(userType);
  }

  const userRes = await db.query(query, params);

  if (userRes.rowCount === 0) {
    throw new Error("Invalid credentials");
  }

  const user = userRes.rows[0];

  // Verify password
  const passwordMatch = await verifyPassword(password, user.password_hash);
  if (!passwordMatch) {
    throw new Error("Invalid credentials");
  }

  // Create access token
  const accessToken = createAccessToken(user.id, user.role);

  // Create refresh token
  const refreshToken = createRefreshToken();
  const refreshTokenHash = await hashPassword(refreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_EXPIRE);

  // Store refresh token in database
  await db.query(
    "INSERT INTO sessions (user_id, refresh_token_hash, user_agent, ip_address, expires_at) VALUES ($1, $2, $3, $4, $5)",
    [user.id, refreshTokenHash, userAgent, ipAddress, expiresAt]
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: "15m",
  };
}

/**
 * Refresh: exchange refresh token for new access token
 */
async function refreshAccessToken(refreshToken) {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  // Find session by checking refresh token hash (this is tricky because we only have the hash)
  // In a real app, you'd store the refresh token ID separately
  // For now, we'll implement a simpler approach: store the refresh token unhashed (only in server DB)
  // or we can search by user_id if we know it

  // Simplified: assume we pass user_id + refresh_token
  // Better approach: issue a JWT refresh token or store session ID separately
  throw new Error("Refresh token validation needs session ID or user context");
}

/**
 * Logout: revoke refresh token by deleting session
 */
async function logout(userId, refreshToken) {
  if (!userId || !refreshToken) {
    throw new Error("User ID and refresh token are required");
  }

  // Find and delete the session
  // Since we only store the hash, we need to search by user_id
  // and verify the token (this is complex with hashes)
  // Simpler: just delete all sessions for the user on logout
  await db.query("DELETE FROM sessions WHERE user_id = $1", [userId]);

  return true;
}

/**
 * Get user by ID
 */
async function getUserById(userId) {
  const result = await db.query("SELECT id, email, full_name, role, user_type, is_active FROM users WHERE id = $1", [userId]);
  if (result.rowCount === 0) {
    return null;
  }
  return result.rows[0];
}

module.exports = {
  hashPassword,
  verifyPassword,
  createAccessToken,
  createRefreshToken,
  verifyAccessToken,
  signup,
  login,
  logout,
  getUserById,
  JWT_SECRET,
};
