const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleAuth = require("../middleware/roleAuth.middleware");

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
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *           description: User's name
 *         email:
 *           type: string
 *           description: User's email
 *         role:
 *           type: string
 *           enum: [user, editor, admin]
 *           description: User's role
 *         avatar:
 *           type: string
 *           description: URL to user's avatar
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Account creation timestamp
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and profile operations
 */

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       Retrieves the profile of the currently authenticated user.
 *       Requires a valid JWT token.
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   patch:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     description: |
 *       Updates the profile of the currently authenticated user.
 *       Only certain fields can be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Smith"
 *               avatar:
 *                 type: string
 *                 example: "https://example.com/new-avatar.jpg"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Invalid updates
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

// Apply authentication middleware to all routes
router.use(authMiddleware);

// User routes
router.get("/profile", userController.getCurrentUser);
router.patch("/profile", userController.updateProfile);

// Admin routes - add authMiddleware before roleAuth
router.get("/", authMiddleware, roleAuth("admin"), userController.getAllUsers);

router.patch(
  "/:userId/role",
  authMiddleware,
  roleAuth("admin"),
  userController.updateUserRole
);

router.delete(
  "/:userId",
  authMiddleware,
  roleAuth("admin"),
  userController.deleteUser
);

module.exports = router;
