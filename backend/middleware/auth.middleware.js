/**
 * Authentication Middleware
 * 
 * Provides JWT authentication and role-based authorization.
 * These middleware functions protect routes and control access.
 */

const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { ROLES, USER_STATUS } = require('../config/constants');

/**
 * Authenticate JWT Token
 * 
 * Verifies the JWT token from Authorization header.
 * Attaches the user object to req.user if valid.
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Access denied. No token provided.'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user and check if still exists/active
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({
        error: 'User not found. Token is invalid.'
      });
    }
    
    // Check if user is blocked
    if (user.status === USER_STATUS.BLOCKED) {
      return res.status(403).json({
        error: 'Account is blocked. Contact administrator.'
      });
    }
    
    // Attach user to request
    req.user = user;
    req.userId = user._id;
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({ error: 'Authentication error' });
  }
};

/**
 * Role-Based Authorization Factory
 * 
 * Creates middleware that restricts access to specific roles.
 * @param {...string} allowedRoles - Roles that can access the route
 * @returns {Function} Express middleware function
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // Ensure authenticate middleware ran first
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }
    
    // Check if user's role is in allowed roles
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied. Insufficient permissions.',
        required: allowedRoles,
        current: req.user.role
      });
    }
    
    next();
  };
};

/**
 * Check if user is a student
 */
const isStudent = authorize(ROLES.STUDENT);

/**
 * Check if user is a teacher
 */
const isTeacher = authorize(ROLES.TEACHER);

/**
 * Check if user is a club
 */
const isClub = authorize(ROLES.CLUB);

/**
 * Check if user is an admin
 */
const isAdmin = authorize(ROLES.ADMIN);

/**
 * Check if user is a student or teacher
 */
const isStudentOrTeacher = authorize(ROLES.STUDENT, ROLES.TEACHER);

/**
 * Optional Authentication
 * 
 * Similar to authenticate but doesn't fail if no token.
 * Useful for routes that behave differently for logged-in users.
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (user && user.status === USER_STATUS.ACTIVE) {
      req.user = user;
      req.userId = user._id;
    }
    
    next();
  } catch (error) {
    // Token invalid, but continue without auth
    next();
  }
};

module.exports = {
  authenticate,
  authorize,
  isStudent,
  isTeacher,
  isClub,
  isAdmin,
  isStudentOrTeacher,
  optionalAuth
};
