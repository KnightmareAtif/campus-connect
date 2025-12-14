/**
 * Teacher Routes
 * 
 * Routes for teacher-specific functionality:
 * - Profile management
 * - Teaching timetable
 * - Office hours
 */

const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher.controller');
const { authenticate, isTeacher, optionalAuth } = require('../middleware/auth.middleware');
const { timetableValidation, mongoIdValidation } = require('../middleware/validation.middleware');

// =============================================================================
// PUBLIC ROUTES (accessible to all authenticated users)
// =============================================================================

/**
 * @route   GET /api/teacher/all
 * @desc    Get all teachers
 * @access  Public
 */
router.get('/all', teacherController.getAllTeachers);

/**
 * @route   GET /api/teacher/:teacherId/availability
 * @desc    Get a specific teacher's availability
 * @access  Public
 */
router.get('/:teacherId/availability', mongoIdValidation('teacherId'), teacherController.getTeacherAvailability);

// =============================================================================
// PROTECTED ROUTES (Teacher only)
// =============================================================================

/**
 * @route   GET /api/teacher/profile
 * @desc    Get teacher's own profile
 * @access  Private (Teacher)
 */
router.get('/profile', authenticate, isTeacher, teacherController.getProfile);

/**
 * @route   PUT /api/teacher/profile
 * @desc    Update teacher's profile
 * @access  Private (Teacher)
 */
router.put('/profile', authenticate, isTeacher, teacherController.updateProfile);

/**
 * @route   GET /api/teacher/timetable
 * @desc    Get teacher's teaching timetable
 * @access  Private (Teacher)
 */
router.get('/timetable', authenticate, isTeacher, teacherController.getTimetable);

/**
 * @route   POST /api/teacher/timetable
 * @desc    Update teacher's teaching timetable
 * @access  Private (Teacher)
 */
router.post('/timetable', authenticate, isTeacher, timetableValidation, teacherController.updateTimetable);

/**
 * @route   GET /api/teacher/office-hours
 * @desc    Get teacher's office hours
 * @access  Private (Teacher)
 */
router.get('/office-hours', authenticate, isTeacher, teacherController.getOfficeHours);

/**
 * @route   POST /api/teacher/office-hours
 * @desc    Update teacher's office hours
 * @access  Private (Teacher)
 */
router.post('/office-hours', authenticate, isTeacher, teacherController.updateOfficeHours);

module.exports = router;
