/**
 * User Model
 * 
 * Represents all users in the system (students, teachers, clubs, admins).
 * Uses a single model with a role field to differentiate user types.
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { ROLES, USER_STATUS } = require('../config/constants');

const userSchema = new mongoose.Schema({
  // Basic user information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  
  // User role - determines access level and features
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.STUDENT
  },
  
  // Account status for admin control
  status: {
    type: String,
    enum: Object.values(USER_STATUS),
    default: USER_STATUS.ACTIVE
  },
  
  // Profile picture URL
  avatar: {
    type: String,
    default: null
  },
  
  // Phone number (optional)
  phone: {
    type: String,
    default: null
  },
  
  // For teachers - their department/subject
  department: {
    type: String,
    default: null
  },
  
  // For teachers - cabin/office location
  cabin: {
    type: String,
    default: null
  },
  
  // For clubs - description
  description: {
    type: String,
    default: null
  },
  
  // For clubs - category
  category: {
    type: String,
    default: null
  },
  
  // References to friends (for students)
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // Clubs that the student follows
  followingClubs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  
  // For clubs - followers count (denormalized for performance)
  followersCount: {
    type: Number,
    default: 0
  }
  
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// =============================================================================
// MIDDLEWARE (Hooks)
// =============================================================================

/**
 * Pre-save middleware to hash password before saving
 */
userSchema.pre('save', async function(next) {
  // Only hash if password is modified
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// =============================================================================
// INSTANCE METHODS
// =============================================================================

/**
 * Compare entered password with stored hashed password
 * @param {string} candidatePassword - Password to check
 * @returns {Promise<boolean>} True if passwords match
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * Get user's public profile (excludes sensitive data)
 * @returns {Object} Public user data
 */
userSchema.methods.toPublicJSON = function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    avatar: this.avatar,
    phone: this.phone,
    department: this.department,
    cabin: this.cabin,
    description: this.description,
    category: this.category,
    followersCount: this.followersCount,
    createdAt: this.createdAt
  };
};

// =============================================================================
// STATIC METHODS
// =============================================================================

/**
 * Find user by email
 * @param {string} email - User email
 * @returns {Promise<User>} User document
 */
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Create and export the model
const User = mongoose.model('User', userSchema);

module.exports = User;
