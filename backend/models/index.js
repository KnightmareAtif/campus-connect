/**
 * Models Index
 * 
 * Central export point for all Mongoose models.
 * Import models from here for cleaner imports.
 */

const User = require('./User');
const Timetable = require('./Timetable');
const FriendRequest = require('./FriendRequest');
const Group = require('./Group');
const Message = require('./Message');
const Event = require('./Event');

module.exports = {
  User,
  Timetable,
  FriendRequest,
  Group,
  Message,
  Event
};
