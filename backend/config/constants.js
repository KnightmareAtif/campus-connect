/**
 * Application Constants
 * 
 * Centralized location for all constant values used across the application.
 */

// User roles enum - matches the User model
const ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  CLUB: 'CLUB',
  ADMIN: 'ADMIN'
};

// Days of the week for timetables
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// Friend request statuses
const FRIEND_REQUEST_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED'
};

// User account statuses
const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED'
};

// Event statuses
const EVENT_STATUS = {
  UPCOMING: 'UPCOMING',
  ONGOING: 'ONGOING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};

// Pagination defaults
const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100
};

module.exports = {
  ROLES,
  DAYS,
  FRIEND_REQUEST_STATUS,
  USER_STATUS,
  EVENT_STATUS,
  PAGINATION
};
