const User = require("../models/User");
const AppError = require("../utils/AppError");

const userController = {
  // Get current user profile
  getCurrentUser: async (req, res, next) => {
    try {
      const user = await User.findById(req.user.id).select("-googleId");
      if (!user) {
        return next(new AppError("User not found", 404));
      }
      res.json({ success: true, data: user });
    } catch (error) {
      next(new AppError("Error fetching user profile", 500));
    }
  },

  // Update user profile
  updateProfile: async (req, res, next) => {
    try {
      const allowedUpdates = ["name", "avatar"];
      const updates = Object.keys(req.body);
      const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
      );

      if (!isValidOperation) {
        return next(new AppError("Invalid updates", 400));
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return next(new AppError("User not found", 404));
      }

      updates.forEach((update) => (user[update] = req.body[update]));
      await user.save();

      res.json({ success: true, data: user });
    } catch (error) {
      next(new AppError("Error updating profile", 500));
    }
  },

  // Admin: Get all users
  getAllUsers: async (req, res, next) => {
    try {
      if (req.user.role !== "admin") {
        return next(new AppError("Not authorized", 403));
      }

      const users = await User.find().select("-googleId");
      res.json({ success: true, data: users });
    } catch (error) {
      next(new AppError("Error fetching users", 500));
    }
  },

  // Admin: Update user role
  updateUserRole: async (req, res, next) => {
    try {
      // Check admin authorization
      if (req.user.role !== "admin") {
        return next(new AppError("Not authorized", 403));
      }

      const { role } = req.body;
      const { userId } = req.params;

      // Validate role
      const allowedRoles = ["user", "editor", "admin"];
      if (!allowedRoles.includes(role)) {
        return next(new AppError("Invalid role", 400));
      }

      // Validate userId
      if (!userId) {
        return next(new AppError("User ID is required", 400));
      }

      let user;

      // Try to find by MongoDB ObjectId first
      try {
        user = await User.findById(userId);
      } catch (err) {
        // If not a valid ObjectId, try finding by googleId
        user = await User.findOne({ googleId: userId });
      }

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      // Update role
      user.role = role;
      const updatedUser = await user.save();

      res.json({
        success: true,
        data: updatedUser,
      });
    } catch (error) {
      next(new AppError(`Error updating user role: ${error.message}`, 500));
    }
  },

  // Admin: Delete user
  deleteUser: async (req, res, next) => {
    try {
      // Check admin authorization
      if (req.user.role !== "admin") {
        return next(new AppError("Not authorized", 403));
      }

      const { userId } = req.params;

      // Validate userId
      if (!userId) {
        return next(new AppError("User ID is required", 400));
      }

      let user;

      // Try to find by MongoDB ObjectId first
      try {
        user = await User.findById(userId);
      } catch (err) {
        // If not a valid ObjectId, try finding by googleId
        user = await User.findOne({ googleId: userId });
      }

      if (!user) {
        return next(new AppError("User not found", 404));
      }

      // Use deleteOne instead of remove
      await User.deleteOne({ _id: user._id });

      res.json({
        success: true,
        message: "User deleted successfully",
        data: {
          id: user._id,
          email: user.email,
        },
      });
    } catch (error) {
      next(new AppError(`Error deleting user: ${error.message}`, 500));
    }
  },
};

module.exports = userController;
