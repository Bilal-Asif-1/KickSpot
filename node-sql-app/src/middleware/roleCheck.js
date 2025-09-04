// Role check middleware
// Provides isAdmin guard for admin-only routes

// This middleware expects req.user to be populated by the auth middleware.
// It supports either a boolean flag `isAdmin` or a string `role` set to 'admin'.
// If your User model doesn't yet include these fields, all admin routes will
// respond with 403 Forbidden until you add one of them.

const isAdmin = (req, res, next) => {
  // Ensure user is authenticated first
  if (!req.user) {
    return res.unauthorized('Unauthorized: no user in request context');
  }

  // Allow if explicit boolean flag is present
  if (req.user.isAdmin === true) {
    return next();
  }

  // Allow if role property indicates admin
  if (typeof req.user.role === 'string' && req.user.role.toLowerCase() === 'admin') {
    return next();
  }

  // Otherwise, deny access
  return res.forbidden('Admin access required');
};

module.exports = { isAdmin };