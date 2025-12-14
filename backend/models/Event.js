/**
 * Event Model
 * 
 * Represents events posted by clubs.
 * Includes event details, timing, venue, and registration info.
 */

const mongoose = require('mongoose');
const { EVENT_STATUS } = require('../config/constants');

const eventSchema = new mongoose.Schema({
  // Club that posted the event
  club: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Event title
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  
  // Event description
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  
  // Event date
  date: {
    type: Date,
    required: [true, 'Event date is required']
  },
  
  // Event time (stored as string for flexibility)
  time: {
    type: String,
    required: [true, 'Event time is required']
  },
  
  // End time (optional)
  endTime: {
    type: String,
    default: null
  },
  
  // Event venue
  venue: {
    type: String,
    required: [true, 'Event venue is required'],
    maxlength: [200, 'Venue cannot exceed 200 characters']
  },
  
  // Event status
  status: {
    type: String,
    enum: Object.values(EVENT_STATUS),
    default: EVENT_STATUS.UPCOMING
  },
  
  // Event cover image
  coverImage: {
    type: String,
    default: null
  },
  
  // Event category/tags
  category: {
    type: String,
    default: null
  },
  
  // Maximum attendees (null = unlimited)
  maxAttendees: {
    type: Number,
    default: null
  },
  
  // Users registered for the event
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Whether registration is required
  requiresRegistration: {
    type: Boolean,
    default: false
  }
  
}, {
  timestamps: true
});

// =============================================================================
// INDEXES
// =============================================================================

// Index for finding events by club
eventSchema.index({ club: 1 });

// Index for finding upcoming events
eventSchema.index({ date: 1, status: 1 });

// =============================================================================
// VIRTUAL FIELDS
// =============================================================================

// Virtual for registered count
eventSchema.virtual('registeredCount').get(function() {
  return this.registeredUsers.length;
});

// Virtual for checking if spots are available
eventSchema.virtual('spotsAvailable').get(function() {
  if (!this.maxAttendees) return true;
  return this.registeredUsers.length < this.maxAttendees;
});

// Ensure virtuals are included
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

// =============================================================================
// INSTANCE METHODS
// =============================================================================

/**
 * Register a user for the event
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Object>} Result object
 */
eventSchema.methods.registerUser = async function(userId) {
  // Check if already registered
  if (this.registeredUsers.includes(userId)) {
    return { success: false, message: 'Already registered' };
  }
  
  // Check if spots available
  if (this.maxAttendees && this.registeredUsers.length >= this.maxAttendees) {
    return { success: false, message: 'Event is full' };
  }
  
  this.registeredUsers.push(userId);
  await this.save();
  
  return { success: true, message: 'Registered successfully' };
};

/**
 * Unregister a user from the event
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Object>} Result object
 */
eventSchema.methods.unregisterUser = async function(userId) {
  const index = this.registeredUsers.indexOf(userId);
  
  if (index === -1) {
    return { success: false, message: 'Not registered' };
  }
  
  this.registeredUsers.splice(index, 1);
  await this.save();
  
  return { success: true, message: 'Unregistered successfully' };
};

// =============================================================================
// STATIC METHODS
// =============================================================================

/**
 * Get upcoming events
 * @param {number} limit - Maximum events to return
 * @returns {Promise<Array>} Array of upcoming events
 */
eventSchema.statics.getUpcoming = function(limit = 10) {
  return this.find({
    date: { $gte: new Date() },
    status: EVENT_STATUS.UPCOMING
  })
    .populate('club', 'name avatar category')
    .sort({ date: 1 })
    .limit(limit);
};

/**
 * Get events by club
 * @param {ObjectId} clubId - Club ID
 * @returns {Promise<Array>} Array of events
 */
eventSchema.statics.getByClub = function(clubId) {
  return this.find({ club: clubId })
    .sort({ date: -1 });
};

/**
 * Get upcoming events for clubs a user follows
 * @param {Array} clubIds - Array of club IDs
 * @returns {Promise<Array>} Array of events
 */
eventSchema.statics.getForFollowedClubs = function(clubIds) {
  return this.find({
    club: { $in: clubIds },
    date: { $gte: new Date() },
    status: EVENT_STATUS.UPCOMING
  })
    .populate('club', 'name avatar category')
    .sort({ date: 1 });
};

// Create and export the model
const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
