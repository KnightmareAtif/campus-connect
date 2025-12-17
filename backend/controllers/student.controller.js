/**
 * Student Controller
 * 
 * Handles student-specific operations:
 * - Timetable management
 * - Friend requests
 * - Groups and messaging
 * - Viewing friend availability
 */

const { User, Timetable, FriendRequest, Group, Message } = require('../models');
const { FRIEND_REQUEST_STATUS, ROLES } = require('../config/constants');

// =============================================================================
// TIMETABLE OPERATIONS
// =============================================================================

/**
 * Get student's timetable
 * GET /api/student/timetable
 */
const getTimetable = async (req, res) => {
  try {
    let timetable = await Timetable.findOne({ user: req.userId });
    
    if (!timetable) {
      // Return empty timetable structure
      return res.json({
        timetable: null,
        message: 'No timetable found. Create one first.'
      });
    }
    
    res.json({ timetable });
  } catch (error) {
    console.error('Get timetable error:', error);
    res.status(500).json({ error: 'Failed to get timetable' });
  }
};

/**
 * Create or update timetable
 * POST /api/student/timetable
 */
const updateTimetable = async (req, res) => {
  try {
    const { slots, config } = req.body;
    
    let timetable = await Timetable.findOne({ user: req.userId });
    
    if (timetable) {
      // Update existing timetable
      timetable.slots = slots;
      if (config) timetable.config = config;
      await timetable.save();
    } else {
      // Create new timetable
      timetable = new Timetable({
        user: req.userId,
        slots,
        config: config || { periodsPerDay: 5 }
      });
      await timetable.save();
    }
    
    res.json({
      message: 'Timetable saved successfully',
      timetable
    });
  } catch (error) {
    console.error('Update timetable error:', error);
    res.status(500).json({ error: 'Failed to update timetable' });
  }
};

// =============================================================================
// FRIEND OPERATIONS
// =============================================================================

/**
 * Get list of friends
 * GET /api/student/friends
 */
const getFriends = async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('friends', 'name email avatar');
    
    // Get each friend's availability
    const friendsWithStatus = await Promise.all(
      user.friends.map(async (friend) => {
        const timetable = await Timetable.findOne({ user: friend._id });
        const now = new Date();
        const day = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        
        let status = { isFree: true, currentActivity: null };
        if (timetable) {
          status = timetable.getCurrentStatus(day, currentTime);
        }
        
        return {
          ...friend.toObject(),
          status: status.isFree ? 'free' : 'busy',
          currentActivity: status.currentActivity
        };
      })
    );
    
    res.json({ friends: friendsWithStatus });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ error: 'Failed to get friends' });
  }
};

/**
 * Send friend request
 * POST /api/student/friends/request/:userId
 */
const sendFriendRequest = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Can't send request to yourself
    if (userId === req.userId.toString()) {
      return res.status(400).json({ error: 'Cannot send friend request to yourself' });
    }
    
    // Check if target user exists and is a student
    const targetUser = await User.findById(userId);
    if (!targetUser || targetUser.role !== ROLES.STUDENT) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check if already friends
    const currentUser = await User.findById(req.userId);
    if (currentUser.friends.includes(userId)) {
      return res.status(400).json({ error: 'Already friends with this user' });
    }
    
    // Check for existing request
    const existingRequest = await FriendRequest.findBetweenUsers(req.userId, userId);
    if (existingRequest) {
      if (existingRequest.status === FRIEND_REQUEST_STATUS.PENDING) {
        return res.status(400).json({ error: 'Friend request already exists' });
      }
    }
    
    // Create new request
    const request = new FriendRequest({
      from: req.userId,
      to: userId
    });
    await request.save();
    
    res.status(201).json({
      message: 'Friend request sent',
      request
    });
  } catch (error) {
    console.error('Send friend request error:', error);
    res.status(500).json({ error: 'Failed to send friend request' });
  }
};

/**
 * Get pending friend requests
 * GET /api/student/friends/requests
 */
const getPendingRequests = async (req, res) => {
  try {
    const received = await FriendRequest.getPendingForUser(req.userId);
    const sent = await FriendRequest.getSentByUser(req.userId);
    
    res.json({ received, sent });
  } catch (error) {
    console.error('Get pending requests error:', error);
    res.status(500).json({ error: 'Failed to get friend requests' });
  }
};

/**
 * Accept friend request
 * POST /api/student/friends/accept/:requestId
 */
const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const request = await FriendRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    if (request.to.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Cannot accept this request' });
    }
    
    if (request.status !== FRIEND_REQUEST_STATUS.PENDING) {
      return res.status(400).json({ error: 'Request already processed' });
    }
    
    // Update request status
    request.status = FRIEND_REQUEST_STATUS.ACCEPTED;
    await request.save();
    
    // Add each user to other's friends list
    await User.findByIdAndUpdate(request.from, {
      $addToSet: { friends: request.to }
    });
    await User.findByIdAndUpdate(request.to, {
      $addToSet: { friends: request.from }
    });
    
    res.json({ message: 'Friend request accepted' });
  } catch (error) {
    console.error('Accept friend request error:', error);
    res.status(500).json({ error: 'Failed to accept friend request' });
  }
};

/**
 * Reject friend request
 * POST /api/student/friends/reject/:requestId
 */
const rejectFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    
    const request = await FriendRequest.findById(requestId);
    
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    if (request.to.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: 'Cannot reject this request' });
    }
    
    request.status = FRIEND_REQUEST_STATUS.REJECTED;
    await request.save();
    
    res.json({ message: 'Friend request rejected' });
  } catch (error) {
    console.error('Reject friend request error:', error);
    res.status(500).json({ error: 'Failed to reject friend request' });
  }
};

/**
 * Get friend's availability
 * GET /api/student/friends/:userId/availability
 */
const getFriendAvailability = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Check if they are friends
    const currentUser = await User.findById(req.userId);
    if (!currentUser.friends.includes(userId)) {
      return res.status(403).json({ error: 'Not friends with this user' });
    }
    
    const timetable = await Timetable.findOne({ user: userId });
    
    if (!timetable) {
      return res.json({
        message: 'User has no timetable',
        availability: null
      });
    }
    
    // Get free slots for each day
    const availability = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    for (const day of days) {
      availability[day] = timetable.getFreeSlotsForDay(day);
    }
    
    res.json({ availability, periodTimings: timetable.config.periodTimings });
  } catch (error) {
    console.error('Get friend availability error:', error);
    res.status(500).json({ error: 'Failed to get availability' });
  }
};

// =============================================================================
// GROUP OPERATIONS
// =============================================================================

/**
 * Get user's groups
 * GET /api/student/groups
 */
const getGroups = async (req, res) => {
  try {
    const groups = await Group.getGroupsForUser(req.userId);
    
    // Add last message to each group
    const groupsWithLastMessage = await Promise.all(
      groups.map(async (group) => {
        const lastMessage = await Message.getLastMessage(group._id);
        return {
          ...group.toObject(),
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            sender: lastMessage.sender.name,
            timestamp: lastMessage.createdAt
          } : null
        };
      })
    );
    
    res.json({ groups: groupsWithLastMessage });
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ error: 'Failed to get groups' });
  }
};

/**
 * Create a new group
 * POST /api/student/groups
 */
const createGroup = async (req, res) => {
  try {
    const { name, type, description, memberIds } = req.body;
    
    // Create group with creator as first member
    const group = new Group({
      name,
      type: type || 'study',
      description,
      createdBy: req.userId,
      members: [req.userId]
    });
    
    // Add other members if provided
    if (memberIds && memberIds.length > 0) {
      // Verify all members are friends
      const currentUser = await User.findById(req.userId);
      const validMembers = memberIds.filter(id => 
        currentUser.friends.map(f => f.toString()).includes(id)
      );
      group.members.push(...validMembers);
    }
    
    await group.save();
    await group.populate('members', 'name email avatar');
    
    res.status(201).json({
      message: 'Group created successfully',
      group
    });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
};

/**
 * Add member to group
 * POST /api/student/groups/:groupId/members
 */
const addGroupMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    // Check if requester is a member
    if (!group.isMember(req.userId)) {
      return res.status(403).json({ error: 'Only group members can add others' });
    }
    
    await group.addMember(userId);
    await group.populate('members', 'name email avatar');
    
    res.json({ message: 'Member added', group });
  } catch (error) {
    console.error('Add group member error:', error);
    res.status(500).json({ error: 'Failed to add member' });
  }
};

/**
 * Get messages for a group
 * GET /api/student/groups/:groupId/messages
 */
const getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    if (!group.isMember(req.userId)) {
      return res.status(403).json({ error: 'Not a member of this group' });
    }
    
    const messages = await Message.getGroupMessages(groupId, parseInt(page), parseInt(limit));
    
    res.json({ messages: messages.reverse() }); // Oldest first
  } catch (error) {
    console.error('Get group messages error:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
};

/**
 * Send message to group
 * POST /api/student/groups/:groupId/messages
 */
const sendGroupMessage = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { content } = req.body;
    
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    if (!group.isMember(req.userId)) {
      return res.status(403).json({ error: 'Not a member of this group' });
    }
    
    const message = new Message({
      group: groupId,
      sender: req.userId,
      content
    });
    
    await message.save();
    await message.populate('sender', 'name email avatar');
    
    res.status(201).json({ message });
  } catch (error) {
    console.error('Send group message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

/**
 * Remove member from group
 * DELETE /api/student/groups/:groupId/members/:userId
 */
const removeGroupMember = async (req, res) => {
  try {
    const { groupId, userId } = req.params;
    
    const group = await Group.findById(groupId);
    
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }
    
    if (!group.isMember(req.userId)) {
      return res.status(403).json({ error: 'Only group members can remove others' });
    }
    
    group.members = group.members.filter(m => m.toString() !== userId);
    await group.save();
    await group.populate('members', 'name email avatar');
    
    res.json({ message: 'Member removed', group });
  } catch (error) {
    console.error('Remove group member error:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
};

/**
 * Update student profile (contact details)
 * PUT /api/student/profile
 */
const updateProfile = async (req, res) => {
  try {
    const { phone, contactEmail } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      { phone, contactEmail },
      { new: true, runValidators: true }
    );
    
    res.json({ message: 'Profile updated', user: user.toPublicJSON() });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

module.exports = {
  getTimetable,
  updateTimetable,
  getFriends,
  sendFriendRequest,
  getPendingRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendAvailability,
  getGroups,
  createGroup,
  addGroupMember,
  removeGroupMember,
  getGroupMessages,
  sendGroupMessage,
  updateProfile
};
