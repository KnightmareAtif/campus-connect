/**
 * Group Model
 * 
 * Represents study groups or project teams created by students.
 * Groups can have multiple members and associated messages.
 */

const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  // Group name
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    maxlength: [100, 'Group name cannot exceed 100 characters']
  },
  
  // Group type
  type: {
    type: String,
    enum: ['study', 'project'],
    default: 'study'
  },
  
  // Description of the group
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: null
  },
  
  // User who created the group
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Group members (includes creator)
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Group avatar/image URL
  avatar: {
    type: String,
    default: null
  },
  
  // Whether the group is active
  isActive: {
    type: Boolean,
    default: true
  }
  
}, {
  timestamps: true
});

// =============================================================================
// INDEXES
// =============================================================================

// Index for finding groups by member
groupSchema.index({ members: 1 });

// Index for finding groups by creator
groupSchema.index({ createdBy: 1 });

// =============================================================================
// VIRTUAL FIELDS
// =============================================================================

// Virtual for member count
groupSchema.virtual('memberCount').get(function() {
  return this.members.length;
});

// Ensure virtuals are included in JSON output
groupSchema.set('toJSON', { virtuals: true });
groupSchema.set('toObject', { virtuals: true });

// =============================================================================
// INSTANCE METHODS
// =============================================================================

/**
 * Check if a user is a member of the group
 * @param {ObjectId} userId - User ID to check
 * @returns {boolean} True if user is a member
 */
groupSchema.methods.isMember = function(userId) {
  return this.members.some(member => member.equals(userId));
};

/**
 * Add a member to the group
 * @param {ObjectId} userId - User ID to add
 * @returns {Promise<Group>} Updated group
 */
groupSchema.methods.addMember = async function(userId) {
  if (!this.isMember(userId)) {
    this.members.push(userId);
    await this.save();
  }
  return this;
};

/**
 * Remove a member from the group
 * @param {ObjectId} userId - User ID to remove
 * @returns {Promise<Group>} Updated group
 */
groupSchema.methods.removeMember = async function(userId) {
  this.members = this.members.filter(member => !member.equals(userId));
  await this.save();
  return this;
};

// =============================================================================
// STATIC METHODS
// =============================================================================

/**
 * Get all groups for a user
 * @param {ObjectId} userId - User ID
 * @returns {Promise<Array>} Array of groups
 */
groupSchema.statics.getGroupsForUser = function(userId) {
  return this.find({ members: userId, isActive: true })
    .populate('members', 'name email avatar')
    .populate('createdBy', 'name email avatar')
    .sort({ updatedAt: -1 });
};

// Create and export the model
const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
