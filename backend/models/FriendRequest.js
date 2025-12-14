/**
 * FriendRequest Model
 * 
 * Manages friend requests between students.
 * Tracks the sender, receiver, and status of each request.
 */

const mongoose = require('mongoose');
const { FRIEND_REQUEST_STATUS } = require('../config/constants');

const friendRequestSchema = new mongoose.Schema({
  // User who sent the request
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // User who receives the request
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Current status of the request
  status: {
    type: String,
    enum: Object.values(FRIEND_REQUEST_STATUS),
    default: FRIEND_REQUEST_STATUS.PENDING
  }
  
}, {
  timestamps: true
});

// =============================================================================
// INDEXES
// =============================================================================

// Compound index to ensure unique requests between users
friendRequestSchema.index({ from: 1, to: 1 }, { unique: true });

// Index for finding pending requests for a user
friendRequestSchema.index({ to: 1, status: 1 });

// =============================================================================
// STATIC METHODS
// =============================================================================

/**
 * Check if a friend request exists between two users
 * @param {ObjectId} userId1 - First user ID
 * @param {ObjectId} userId2 - Second user ID
 * @returns {Promise<FriendRequest|null>} Existing request or null
 */
friendRequestSchema.statics.findBetweenUsers = function(userId1, userId2) {
  return this.findOne({
    $or: [
      { from: userId1, to: userId2 },
      { from: userId2, to: userId1 }
    ]
  });
};

/**
 * Get pending requests for a user
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Array>} Array of pending friend requests
 */
friendRequestSchema.statics.getPendingForUser = function(userId) {
  return this.find({
    to: userId,
    status: FRIEND_REQUEST_STATUS.PENDING
  }).populate('from', 'name email avatar');
};

/**
 * Get sent requests by a user
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Array>} Array of sent friend requests
 */
friendRequestSchema.statics.getSentByUser = function(userId) {
  return this.find({
    from: userId,
    status: FRIEND_REQUEST_STATUS.PENDING
  }).populate('to', 'name email avatar');
};

// Create and export the model
const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

module.exports = FriendRequest;
