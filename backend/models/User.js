const mongoose = require("mongoose");

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - googleId
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated MongoDB ID
 *           example: "507f1f77bcf86cd799439011"
 *         googleId:
 *           type: string
 *           description: Google OAuth ID
 *           example: "118234234234234234234"
 *         name:
 *           type: string
 *           description: User's full name
 *           example: "John Doe"
 *         email:
 *           type: string
 *           format: email
 *           description: User's email address
 *           example: "john@example.com"
 *         role:
 *           type: string
 *           enum: [user, editor, admin]
 *           description: User's role in the system
 *           example: "user"
 *         avatar:
 *           type: string
 *           description: URL to user's profile picture
 *           example: "https://example.com/avatar.jpg"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 *           example: "2024-01-20T12:00:00Z"
 */

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  avatar: String,
  role: {
    type: String,
    enum: ["admin", "editor", "user"],
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", userSchema);
