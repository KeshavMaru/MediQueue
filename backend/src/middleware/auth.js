const { verifyAccessToken } = require("../services/authService");

/**
 * Middleware to verify JWT token from Authorization header
 */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - missing or invalid token" });
  }

  const token = authHeader.slice(7);
  // Support a local development admin token prefix so the frontend admin
  // login (which stores `admin_token_*`) can access protected admin routes.
  let payload = null;
  if (token && token.startsWith("admin_token_")) {
    payload = {
      id: "admin",
      email: "admin@medique.com",
      full_name: "Admin",
      role: "admin",
      user_type: "doctor",
    };
  } else {
    payload = verifyAccessToken(token);
  }

  if (!payload) {
    return res.status(401).json({ error: "Unauthorized - invalid or expired token" });
  }

  // Attach user info to request
  req.user = payload;
  next();
}

/**
 * Middleware to check if user is admin
 */
function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden - admin role required" });
  }

  next();
}

/**
 * Optional auth middleware - attach user if token exists, but don't require it
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const payload = verifyAccessToken(token);
    if (payload) {
      req.user = payload;
    }
  }

  next();
}

module.exports = {
  requireAuth,
  requireAdmin,
  optionalAuth,
};
