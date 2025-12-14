/**
 * Admin Routes
 * 
 * Routes for admin functionality:
 * - User management
 * - Event moderation
 * - Platform statistics
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');
const { mongoIdValidation, paginationValidation } = require('../middleware/validation.middleware');

// All admin routes require authentication and admin role
router.use(authenticate, isAdmin);

// =============================================================================
// USER MANAGEMENT ROUTES
// =============================================================================

/**
 * @route   GET /api/admin/users
 * @desc    Get all users with pagination and filters
 * @access  Private (Admin)
 */
router.get('/users', paginationValidation, adminController.getAllUsers);

/**
 * @route   GET /api/admin/users/:userId
 * @desc    Get user details
 * @access  Private (Admin)
 */
router.get('/users/:userId', mongoIdValidation('userId'), adminController.getUserDetails);

/**
 * @route   POST /api/admin/users/:userId/block
 * @desc    Block a user
 * @access  Private (Admin)
 */
router.post('/users/:userId/block', mongoIdValidation('userId'), adminController.blockUser);

/**
 * @route   POST /api/admin/users/:userId/unblock
 * @desc    Unblock a user
 * @access  Private (Admin)
 */
router.post('/users/:userId/unblock', mongoIdValidation('userId'), adminController.unblockUser);

/**
 * @route   DELETE /api/admin/users/:userId
 * @desc    Delete a user
 * @access  Private (Admin)
 */
router.delete('/users/:userId', mongoIdValidation('userId'), adminController.deleteUser);

// =============================================================================
// EVENT MANAGEMENT ROUTES
// =============================================================================

/**
 * @route   GET /api/admin/events
 * @desc    Get all events with pagination
 * @access  Private (Admin)
 */
router.get('/events', paginationValidation, adminController.getAllEvents);

/**
 * @route   DELETE /api/admin/events/:eventId
 * @desc    Delete an event
 * @access  Private (Admin)
 */
router.delete('/events/:eventId', mongoIdValidation('eventId'), adminController.deleteEvent);

// =============================================================================
// STATISTICS ROUTES
// =============================================================================

/**
 * @route   GET /api/admin/stats
 * @desc    Get platform statistics
 * @access  Private (Admin)
 */
router.get('/stats', adminController.getStats);

module.exports = router;
