/**
 * Admin Controller
 * 
 * Handles admin-specific operations:
 * - User management (view, block, delete)
 * - Event management
 * - Platform statistics
 */

const { User, Event } = require('../models');
const { USER_STATUS, PAGINATION } = require('../config/constants');

/**
 * Get all users with pagination and filters
 * GET /api/admin/users
 */
const getAllUsers = async (req, res) => {
  try {
    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      role,
      status,
      search
    } = req.query;
    
    const query = {};
    
    // Filter by role
    if (role) {
      query.role = role;
    }
    
    // Filter by status
    if (status) {
      query.status = status;
    }
    
    // Search by name or email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query)
    ]);
    
    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
};

/**
 * Get user details
 * GET /api/admin/users/:userId
 */
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to get user details' });
  }
};

/**
 * Block a user
 * POST /api/admin/users/:userId/block
 */
const blockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent blocking admins
    if (user.role === 'ADMIN') {
      return res.status(403).json({ error: 'Cannot block admin users' });
    }
    
    // Prevent self-blocking
    if (userId === req.userId.toString()) {
      return res.status(400).json({ error: 'Cannot block yourself' });
    }
    
    user.status = USER_STATUS.BLOCKED;
    await user.save();
    
    res.json({
      message: 'User blocked successfully',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ error: 'Failed to block user' });
  }
};

/**
 * Unblock a user
 * POST /api/admin/users/:userId/unblock
 */
const unblockUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.status = USER_STATUS.ACTIVE;
    await user.save();
    
    res.json({
      message: 'User unblocked successfully',
      user: user.toPublicJSON()
    });
  } catch (error) {
    console.error('Unblock user error:', error);
    res.status(500).json({ error: 'Failed to unblock user' });
  }
};

/**
 * Delete a user
 * DELETE /api/admin/users/:userId
 */
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent deleting admins
    if (user.role === 'ADMIN') {
      return res.status(403).json({ error: 'Cannot delete admin users' });
    }
    
    // Prevent self-deletion
    if (userId === req.userId.toString()) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }
    
    await User.findByIdAndDelete(userId);
    
    // Also delete related data (timetables, events if club, etc.)
    // In production, you might want to soft-delete instead
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

/**
 * Get all events (for moderation)
 * GET /api/admin/events
 */
const getAllEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = {};
    if (status) {
      query.status = status;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [events, total] = await Promise.all([
      Event.find(query)
        .populate('club', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Event.countDocuments(query)
    ]);
    
    res.json({
      events,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get all events error:', error);
    res.status(500).json({ error: 'Failed to get events' });
  }
};

/**
 * Delete an event
 * DELETE /api/admin/events/:eventId
 */
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findByIdAndDelete(eventId);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

/**
 * Get platform statistics
 * GET /api/admin/stats
 */
const getStats = async (req, res) => {
  try {
    const [
      totalUsers,
      studentCount,
      teacherCount,
      clubCount,
      activeUsers,
      blockedUsers,
      totalEvents,
      upcomingEvents
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: 'STUDENT' }),
      User.countDocuments({ role: 'TEACHER' }),
      User.countDocuments({ role: 'CLUB' }),
      User.countDocuments({ status: 'ACTIVE' }),
      User.countDocuments({ status: 'BLOCKED' }),
      Event.countDocuments(),
      Event.countDocuments({ date: { $gte: new Date() }, status: 'UPCOMING' })
    ]);
    
    res.json({
      users: {
        total: totalUsers,
        students: studentCount,
        teachers: teacherCount,
        clubs: clubCount,
        active: activeUsers,
        blocked: blockedUsers
      },
      events: {
        total: totalEvents,
        upcoming: upcomingEvents
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
};

module.exports = {
  getAllUsers,
  getUserDetails,
  blockUser,
  unblockUser,
  deleteUser,
  getAllEvents,
  deleteEvent,
  getStats
};
