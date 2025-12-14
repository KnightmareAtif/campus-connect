/**
 * Timetable Model
 * 
 * Stores timetable information for students and teachers.
 * Each user can have one timetable with multiple time slots.
 */

const mongoose = require('mongoose');
const { DAYS } = require('../config/constants');

// Schema for individual time slots
const timeSlotSchema = new mongoose.Schema({
  day: {
    type: String,
    enum: DAYS,
    required: true
  },
  
  period: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  
  // Start time in HH:MM format
  startTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
  },
  
  // End time in HH:MM format
  endTime: {
    type: String,
    required: true,
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format']
  },
  
  // Subject name (null means free period)
  subject: {
    type: String,
    default: null
  },
  
  // Room/venue
  room: {
    type: String,
    default: null
  },
  
  // For students - teacher name
  // For teachers - class/section
  additionalInfo: {
    type: String,
    default: null
  }
});

// Main timetable schema
const timetableSchema = new mongoose.Schema({
  // Owner of the timetable
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // One timetable per user
  },
  
  // Array of time slots
  slots: [timeSlotSchema],
  
  // Timetable configuration
  config: {
    periodsPerDay: {
      type: Number,
      default: 5,
      min: 1,
      max: 10
    },
    
    // Default period timings
    periodTimings: [{
      period: Number,
      startTime: String,
      endTime: String
    }]
  }
  
}, {
  timestamps: true
});

// =============================================================================
// INSTANCE METHODS
// =============================================================================

/**
 * Get free slots for a specific day
 * @param {string} day - Day of the week
 * @returns {Array} Array of free period numbers
 */
timetableSchema.methods.getFreeSlotsForDay = function(day) {
  const busyPeriods = this.slots
    .filter(slot => slot.day === day && slot.subject)
    .map(slot => slot.period);
  
  const allPeriods = Array.from(
    { length: this.config.periodsPerDay },
    (_, i) => i + 1
  );
  
  return allPeriods.filter(p => !busyPeriods.includes(p));
};

/**
 * Check if user is free at a specific time
 * @param {string} day - Day of the week
 * @param {number} period - Period number
 * @returns {boolean} True if free
 */
timetableSchema.methods.isFreeAt = function(day, period) {
  const slot = this.slots.find(s => s.day === day && s.period === period);
  return !slot || !slot.subject;
};

/**
 * Get current status based on day and time
 * @param {string} day - Current day
 * @param {string} currentTime - Current time in HH:MM format
 * @returns {Object} Status object with isFree and currentActivity
 */
timetableSchema.methods.getCurrentStatus = function(day, currentTime) {
  const currentSlot = this.slots.find(slot => {
    if (slot.day !== day) return false;
    return slot.startTime <= currentTime && currentTime < slot.endTime;
  });
  
  if (!currentSlot || !currentSlot.subject) {
    return { isFree: true, currentActivity: null };
  }
  
  return {
    isFree: false,
    currentActivity: currentSlot.subject,
    room: currentSlot.room
  };
};

// Create and export the model
const Timetable = mongoose.model('Timetable', timetableSchema);

module.exports = Timetable;
