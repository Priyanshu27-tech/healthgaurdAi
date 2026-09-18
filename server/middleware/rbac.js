/**
 * Role-based access control middleware
 * Checks if authenticated user has one of the required roles
 */
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before role verification.',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' is not authorized to perform this clinical or administrative action.`,
      });
    }

    next();
  };
};

module.exports = { authorizeRole };
