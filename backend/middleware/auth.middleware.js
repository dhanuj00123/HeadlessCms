const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return next(
        new AppError("Please provide a valid authentication token", 401)
      );
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return next(new AppError("No token provided", 401));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      req.user = user;
      next();
    } catch (error) {
      return next(new AppError("Invalid or expired token", 401));
    }
  } catch (error) {
    return next(new AppError("Authentication failed", 401));
  }
};

module.exports = authMiddleware;
