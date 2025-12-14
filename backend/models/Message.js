/**
 * Message Model
 * 
 * Stores messages sent within groups.
 * Supports text messages with optional attachments.
 */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Group this message belongs to
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  
  // User who sent the message
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Message content
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  
  // Message type
  type: {
    type: String,
    enum: ['text', 'image', 'file'],
    default: 'text'
  },
  
  // Attachment URL (for images/files)
  attachment: {
    type: String,
    default: null
  },
  
  // Users who have read this message
  readBy: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Whether the message has been deleted
  isDeleted: {
    type: Boolean,
    default: false
  }
  
}, {
  timestamps: true
});

// =============================================================================
// INDEXES
// =============================================================================

// Index for fetching messages by group (sorted by time)
messageSchema.index({ group: 1, createdAt: -1 });

// Index for finding messages by sender
messageSchema.index({ sender: 1 });

// =============================================================================
// INSTANCE METHODS
// =============================================================================

/**
 * Mark message as read by a user
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Message>} Updated message
 */
messageSchema.methods.markAsRead = async function(userId) {
  const alreadyRead = this.readBy.some(r => r.user.equals(userId));
  
  if (!alreadyRead) {
    this.readBy.push({ user: userId, readAt: new Date() });
    await this.save();
  }
  
  return this;
};

/**
 * Soft delete the message
 * @returns {Promise<Message>} Updated message
 */
messageSchema.methods.softDelete = async function() {
  this.isDeleted = true;
  this.content = '[Message deleted]';
  await this.save();
  return this;
};

// =============================================================================
// STATIC METHODS
// =============================================================================

/**
 * Get messages for a group with pagination
 * @param {ObjectId} groupId - Group ID
 * @param {number} page - Page number
 * @param {number} limit - Messages per page
 * @returns {Promise<Array>} Array of messages
 */
messageSchema.statics.getGroupMessages = function(groupId, page = 1, limit = 50) {
  return this.find({ group: groupId, isDeleted: false })
    .populate('sender', 'name email avatar')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};

/**
 * Get the last message in a group
 * @param {ObjectId} groupId - Group ID
 * @returns {Promise<Message|null>} Last message or null
 */
messageSchema.statics.getLastMessage = function(groupId) {
  return this.findOne({ group: groupId, isDeleted: false })
    .populate('sender', 'name')
    .sort({ createdAt: -1 });
};

// Create and export the model
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
