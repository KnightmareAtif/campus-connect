/**
 * Validation Middleware
 * 
 * Uses express-validator for request validation.
 * Provides reusable validation rules and error handling.
 */

const { body, param, query, validationResult } = require('express-validator');

/**
 * Handle validation errors
 * Returns 400 with error details if validation fails
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

// =============================================================================
// AUTHENTICATION VALIDATORS
// =============================================================================

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  
  body('role')
    .optional()
    .isIn(['STUDENT', 'TEACHER', 'CLUB']).withMessage('Invalid role'),
  
  handleValidationErrors
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  handleValidationErrors
];

// =============================================================================
// TIMETABLE VALIDATORS
// =============================================================================

const timetableValidation = [
  body('slots')
    .isArray().withMessage('Slots must be an array'),
  
  body('slots.*.day')
    .isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
    .withMessage('Invalid day'),
  
  body('slots.*.period')
    .isInt({ min: 1, max: 10 }).withMessage('Period must be between 1 and 10'),
  
  body('slots.*.startTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid start time format (HH:MM)'),
  
  body('slots.*.endTime')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Invalid end time format (HH:MM)'),
  
  handleValidationErrors
];

// =============================================================================
// GROUP VALIDATORS
// =============================================================================

const createGroupValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Group name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),
  
  body('type')
    .optional()
    .isIn(['study', 'project']).withMessage('Type must be study or project'),
  
  body('description')
    .optional()
    .isLength({ max: 500 }).withMessage('Description cannot exceed 500 characters'),
  
  handleValidationErrors
];

const messageValidation = [
  body('content')
    .trim()
    .notEmpty().withMessage('Message content is required')
    .isLength({ max: 2000 }).withMessage('Message cannot exceed 2000 characters'),
  
  handleValidationErrors
];

// =============================================================================
// EVENT VALIDATORS
// =============================================================================

const eventValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Event title is required')
    .isLength({ max: 200 }).withMessage('Title cannot exceed 200 characters'),
  
  body('description')
    .trim()
    .notEmpty().withMessage('Event description is required')
    .isLength({ max: 2000 }).withMessage('Description cannot exceed 2000 characters'),
  
  body('date')
    .isISO8601().withMessage('Valid date is required'),
  
  body('time')
    .trim()
    .notEmpty().withMessage('Event time is required'),
  
  body('venue')
    .trim()
    .notEmpty().withMessage('Event venue is required')
    .isLength({ max: 200 }).withMessage('Venue cannot exceed 200 characters'),
  
  handleValidationErrors
];

// =============================================================================
// COMMON VALIDATORS
// =============================================================================

const mongoIdValidation = (paramName) => [
  param(paramName)
    .isMongoId().withMessage(`Invalid ${paramName}`),
  handleValidationErrors
];

const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  registerValidation,
  loginValidation,
  timetableValidation,
  createGroupValidation,
  messageValidation,
  eventValidation,
  mongoIdValidation,
  paginationValidation
};
