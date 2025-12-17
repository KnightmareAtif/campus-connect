/**
 * Student Routes
 * 
 * Routes for student-specific functionality:
 * - Timetable management
 * - Friends and friend requests
 * - Groups and messaging
 */

const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const { authenticate, isStudent } = require('../middleware/auth.middleware');
const { 
  timetableValidation, 
  createGroupValidation, 
  messageValidation,
  mongoIdValidation 
} = require('../middleware/validation.middleware');

// All routes require authentication and student role
router.use(authenticate, isStudent);

// =============================================================================
// TIMETABLE ROUTES
// =============================================================================

/**
 * @route   GET /api/student/timetable
 * @desc    Get student's timetable
 * @access  Private (Student)
 */
router.get('/timetable', studentController.getTimetable);

/**
 * @route   POST /api/student/timetable
 * @desc    Create or update timetable
 * @access  Private (Student)
 */
router.post('/timetable', timetableValidation, studentController.updateTimetable);

// =============================================================================
// FRIENDS ROUTES
// =============================================================================

/**
 * @route   GET /api/student/friends
 * @desc    Get list of friends with current status
 * @access  Private (Student)
 */
router.get('/friends', studentController.getFriends);

/**
 * @route   GET /api/student/friends/requests
 * @desc    Get pending friend requests (sent and received)
 * @access  Private (Student)
 */
router.get('/friends/requests', studentController.getPendingRequests);

/**
 * @route   POST /api/student/friends/request/:userId
 * @desc    Send friend request to a user
 * @access  Private (Student)
 */
router.post('/friends/request/:userId', mongoIdValidation('userId'), studentController.sendFriendRequest);

/**
 * @route   POST /api/student/friends/accept/:requestId
 * @desc    Accept a friend request
 * @access  Private (Student)
 */
router.post('/friends/accept/:requestId', mongoIdValidation('requestId'), studentController.acceptFriendRequest);

/**
 * @route   POST /api/student/friends/reject/:requestId
 * @desc    Reject a friend request
 * @access  Private (Student)
 */
router.post('/friends/reject/:requestId', mongoIdValidation('requestId'), studentController.rejectFriendRequest);

/**
 * @route   GET /api/student/friends/:userId/availability
 * @desc    Get friend's availability based on their timetable
 * @access  Private (Student)
 */
router.get('/friends/:userId/availability', mongoIdValidation('userId'), studentController.getFriendAvailability);

// =============================================================================
// GROUPS ROUTES
// =============================================================================

/**
 * @route   GET /api/student/groups
 * @desc    Get all groups the student is a member of
 * @access  Private (Student)
 */
router.get('/groups', studentController.getGroups);

/**
 * @route   POST /api/student/groups
 * @desc    Create a new group
 * @access  Private (Student)
 */
router.post('/groups', createGroupValidation, studentController.createGroup);

/**
 * @route   POST /api/student/groups/:groupId/members
 * @desc    Add a member to a group
 * @access  Private (Student, group member)
 */
router.post('/groups/:groupId/members', mongoIdValidation('groupId'), studentController.addGroupMember);

/**
 * @route   DELETE /api/student/groups/:groupId/members/:userId
 * @desc    Remove a member from a group
 * @access  Private (Student, group member)
 */
router.delete('/groups/:groupId/members/:userId', mongoIdValidation('groupId'), studentController.removeGroupMember);

/**
 * @route   GET /api/student/groups/:groupId/messages
 * @desc    Get messages for a group
 * @access  Private (Student, group member)
 */
router.get('/groups/:groupId/messages', mongoIdValidation('groupId'), studentController.getGroupMessages);

/**
 * @route   POST /api/student/groups/:groupId/messages
 * @desc    Send a message to a group
 * @access  Private (Student, group member)
 */
router.post('/groups/:groupId/messages', mongoIdValidation('groupId'), messageValidation, studentController.sendGroupMessage);

/**
 * @route   PUT /api/student/profile
 * @desc    Update student profile (contact details)
 * @access  Private (Student)
 */
router.put('/profile', studentController.updateProfile);

module.exports = router;
