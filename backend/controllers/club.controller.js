/**
 * Club Controller
 * 
 * Handles club-specific operations:
 * - Club profile management
 * - Event posting
 * - Follower management
 */

const { User, Event } = require('../models');
const { EVENT_STATUS } = require('../config/constants');

/**
 * Get club profile
 * GET /api/club/profile
 */
const getProfile = async (req, res) => {
  try {
    const club = await User.findById(req.userId);
    res.json({ club: club.toPublicJSON() });
  } catch (error) {
    console.error('Get club profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

/**
 * Update club profile
 * PUT /api/club/profile
 */
const updateProfile = async (req, res) => {
  try {
    const { name, description, category, avatar } = req.body;
    
    const club = await User.findByIdAndUpdate(
      req.userId,
      { name, description, category, avatar },
      { new: true, runValidators: true }
    );
    
    res.json({
      message: 'Profile updated',
      club: club.toPublicJSON()
    });
  } catch (error) {
    console.error('Update club profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

/**
 * Post a new event
 * POST /api/club/events
 */
const createEvent = async (req, res) => {
  try {
    const { title, description, date, time, endTime, venue, category, maxAttendees, requiresRegistration, coverImage } = req.body;
    
    const event = new Event({
      club: req.userId,
      title,
      description,
      date: new Date(date),
      time,
      endTime,
      venue,
      category,
      maxAttendees,
      requiresRegistration: requiresRegistration || false,
      coverImage
    });
    
    await event.save();
    await event.populate('club', 'name avatar category');
    
    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ error: 'Failed to create event' });
  }
};

/**
 * Get club's events
 * GET /api/club/events
 */
const getClubEvents = async (req, res) => {
  try {
    const { status } = req.query;
    
    const query = { club: req.userId };
    if (status) {
      query.status = status;
    }
    
    const events = await Event.find(query)
      .sort({ date: -1 });
    
    res.json({ events });
  } catch (error) {
    console.error('Get club events error:', error);
    res.status(500).json({ error: 'Failed to get events' });
  }
};

/**
 * Update an event
 * PUT /api/club/events/:eventId
 */
const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updates = req.body;
    
    const event = await Event.findOne({ _id: eventId, club: req.userId });
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    // Only allow updating certain fields
    const allowedUpdates = ['title', 'description', 'date', 'time', 'endTime', 'venue', 'category', 'maxAttendees', 'requiresRegistration', 'coverImage', 'status'];
    
    for (const key of allowedUpdates) {
      if (updates[key] !== undefined) {
        event[key] = updates[key];
      }
    }
    
    await event.save();
    
    res.json({
      message: 'Event updated',
      event
    });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
};

/**
 * Delete an event
 * DELETE /api/club/events/:eventId
 */
const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    const event = await Event.findOneAndDelete({ _id: eventId, club: req.userId });
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
};

/**
 * Get club's followers
 * GET /api/club/followers
 */
const getFollowers = async (req, res) => {
  try {
    // Find all users who follow this club
    const followers = await User.find({
      followingClubs: req.userId,
      role: 'STUDENT'
    }).select('name email avatar createdAt');
    
    res.json({
      followersCount: followers.length,
      followers
    });
  } catch (error) {
    console.error('Get followers error:', error);
    res.status(500).json({ error: 'Failed to get followers' });
  }
};

// =============================================================================
// PUBLIC ENDPOINTS (for students)
// =============================================================================

/**
 * Get all clubs
 * GET /api/club/all
 */
const getAllClubs = async (req, res) => {
  try {
    const { search, category } = req.query;
    
    const query = { role: 'CLUB', status: 'ACTIVE' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }
    
    const clubs = await User.find(query)
      .select('name description category avatar followersCount')
      .sort({ followersCount: -1 });
    
    // If user is authenticated, mark which clubs they follow
    let followedClubIds = [];
    if (req.userId) {
      const user = await User.findById(req.userId);
      followedClubIds = user?.followingClubs?.map(id => id.toString()) || [];
    }
    
    const clubsWithFollowing = clubs.map(club => ({
      ...club.toObject(),
      isFollowing: followedClubIds.includes(club._id.toString())
    }));
    
    res.json({ clubs: clubsWithFollowing });
  } catch (error) {
    console.error('Get all clubs error:', error);
    res.status(500).json({ error: 'Failed to get clubs' });
  }
};

/**
 * Follow a club
 * POST /api/club/:clubId/follow
 */
const followClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    
    const club = await User.findById(clubId);
    if (!club || club.role !== 'CLUB') {
      return res.status(404).json({ error: 'Club not found' });
    }
    
    // Add club to user's following list
    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { followingClubs: clubId }
    });
    
    // Increment club's follower count
    await User.findByIdAndUpdate(clubId, {
      $inc: { followersCount: 1 }
    });
    
    res.json({ message: 'Now following club' });
  } catch (error) {
    console.error('Follow club error:', error);
    res.status(500).json({ error: 'Failed to follow club' });
  }
};

/**
 * Unfollow a club
 * POST /api/club/:clubId/unfollow
 */
const unfollowClub = async (req, res) => {
  try {
    const { clubId } = req.params;
    
    // Remove club from user's following list
    await User.findByIdAndUpdate(req.userId, {
      $pull: { followingClubs: clubId }
    });
    
    // Decrement club's follower count
    await User.findByIdAndUpdate(clubId, {
      $inc: { followersCount: -1 }
    });
    
    res.json({ message: 'Unfollowed club' });
  } catch (error) {
    console.error('Unfollow club error:', error);
    res.status(500).json({ error: 'Failed to unfollow club' });
  }
};

/**
 * Get upcoming events (all clubs or followed clubs)
 * GET /api/club/events/upcoming
 */
const getUpcomingEvents = async (req, res) => {
  try {
    const { followedOnly } = req.query;
    
    let events;
    
    if (followedOnly === 'true' && req.userId) {
      const user = await User.findById(req.userId);
      events = await Event.getForFollowedClubs(user.followingClubs || []);
    } else {
      events = await Event.getUpcoming(20);
    }
    
    res.json({ events });
  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({ error: 'Failed to get events' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  createEvent,
  getClubEvents,
  updateEvent,
  deleteEvent,
  getFollowers,
  getAllClubs,
  followClub,
  unfollowClub,
  getUpcomingEvents
};
