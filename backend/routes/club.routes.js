/**
 * Club Routes
 * 
 * Routes for club-specific functionality:
 * - Club profile management
 * - Event posting
 * - Follower management
 */

const express = require('express');
const router = express.Router();
const clubController = require('../controllers/club.controller');
const { authenticate, isClub, isStudent, optionalAuth } = require('../middleware/auth.middleware');
const { eventValidation, mongoIdValidation } = require('../middleware/validation.middleware');

// =============================================================================
// PUBLIC ROUTES
// =============================================================================

/**
 * @route   GET /api/club/all
 * @desc    Get all clubs
 * @access  Public (with optional auth to show follow status)
 */
router.get('/all', optionalAuth, clubController.getAllClubs);

/**
 * @route   GET /api/club/events/upcoming
 * @desc    Get upcoming events
 * @access  Public (with optional auth for followed clubs filter)
 */
router.get('/events/upcoming', optionalAuth, clubController.getUpcomingEvents);

// =============================================================================
// STUDENT ROUTES (for following clubs)
// =============================================================================

/**
 * @route   POST /api/club/:clubId/follow
 * @desc    Follow a club
 * @access  Private (Student)
 */
router.post('/:clubId/follow', authenticate, isStudent, mongoIdValidation('clubId'), clubController.followClub);

/**
 * @route   POST /api/club/:clubId/unfollow
 * @desc    Unfollow a club
 * @access  Private (Student)
 */
router.post('/:clubId/unfollow', authenticate, isStudent, mongoIdValidation('clubId'), clubController.unfollowClub);

// =============================================================================
// CLUB MANAGEMENT ROUTES (Club role only)
// =============================================================================

/**
 * @route   GET /api/club/profile
 * @desc    Get club's own profile
 * @access  Private (Club)
 */
router.get('/profile', authenticate, isClub, clubController.getProfile);

/**
 * @route   PUT /api/club/profile
 * @desc    Update club's profile
 * @access  Private (Club)
 */
router.put('/profile', authenticate, isClub, clubController.updateProfile);

/**
 * @route   GET /api/club/events
 * @desc    Get club's events
 * @access  Private (Club)
 */
router.get('/events', authenticate, isClub, clubController.getClubEvents);

/**
 * @route   POST /api/club/events
 * @desc    Create a new event
 * @access  Private (Club)
 */
router.post('/events', authenticate, isClub, eventValidation, clubController.createEvent);

/**
 * @route   PUT /api/club/events/:eventId
 * @desc    Update an event
 * @access  Private (Club)
 */
router.put('/events/:eventId', authenticate, isClub, mongoIdValidation('eventId'), clubController.updateEvent);

/**
 * @route   DELETE /api/club/events/:eventId
 * @desc    Delete an event
 * @access  Private (Club)
 */
router.delete('/events/:eventId', authenticate, isClub, mongoIdValidation('eventId'), clubController.deleteEvent);

/**
 * @route   GET /api/club/followers
 * @desc    Get club's followers
 * @access  Private (Club)
 */
router.get('/followers', authenticate, isClub, clubController.getFollowers);

module.exports = router;
