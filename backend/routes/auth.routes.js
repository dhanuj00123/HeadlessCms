const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const router = express.Router();

// Wrap async functions to handle errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: Authentication using Google OAuth
 */

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     tags: [Authentication]
 *     description: |
 *       Redirects to Google login page.
 *       After successful authentication, redirects back to the callback URL.
 *     responses:
 *       302:
 *         description: Redirects to Google login page
 */

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Handle Google OAuth callback
 *     tags: [Authentication]
 *     description: |
 *       Handles the callback from Google OAuth.
 *       Returns JWT token and user information on successful authentication.
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 token:
 *                   type: string
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     summary: Logout user
 *     tags: [Authentication]
 *     description: Invalidates the user's session
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 */

// Initialize Google OAuth login
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  asyncHandler(async (req, res, next) => {
    try {
      if (!req.user) {
        return next(new AppError("Authentication failed", 401));
      }

      // Generate JWT token with complete user info
      const token = jwt.sign(
        {
          id: req.user.id,
          email: req.user.email,
          role: req.user.role,
          name: req.user.name,
        },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        success: true,
        token,
        user: {
          id: req.user.id,
          name: req.user.name,
          email: req.user.email,
          role: req.user.role,
          avatar: req.user.avatar,
        },
      });
    } catch (error) {
      return next(new AppError("Error generating authentication token", 500));
    }
  })
);

// Logout route
router.get("/logout", (req, res) => {
  req.logout();
  res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
