const AppError = require("../utils/AppError");

const roleAuth = (...roles) => {
  return (req, res, next) => {
    // Check if user exists
    if (!req.user) {
      return next(new AppError("Authentication required", 401));
    }

    // Check if user role exists
    if (!req.user.role) {
      return next(new AppError("User role not defined", 401));
    }

    // Check if user has required role
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

module.exports = roleAuth;
