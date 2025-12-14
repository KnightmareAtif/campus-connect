/**
 * Teacher Controller
 * 
 * Handles teacher-specific operations:
 * - Profile management
 * - Teaching timetable
 * - Office hours
 */

const { User, Timetable } = require('../models');

/**
 * Get teacher profile
 * GET /api/teacher/profile
 */
const getProfile = async (req, res) => {
  try {
    const teacher = await User.findById(req.userId);
    res.json({ teacher: teacher.toPublicJSON() });
  } catch (error) {
    console.error('Get teacher profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

/**
 * Update teacher profile
 * PUT /api/teacher/profile
 */
const updateProfile = async (req, res) => {
  try {
    const { name, department, cabin, phone, avatar } = req.body;
    
    const teacher = await User.findByIdAndUpdate(
      req.userId,
      { name, department, cabin, phone, avatar },
      { new: true, runValidators: true }
    );
    
    res.json({
      message: 'Profile updated',
      teacher: teacher.toPublicJSON()
    });
  } catch (error) {
    console.error('Update teacher profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

/**
 * Get teaching timetable
 * GET /api/teacher/timetable
 */
const getTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findOne({ user: req.userId });
    
    res.json({
      timetable: timetable || null
    });
  } catch (error) {
    console.error('Get teacher timetable error:', error);
    res.status(500).json({ error: 'Failed to get timetable' });
  }
};

/**
 * Update teaching timetable
 * POST /api/teacher/timetable
 */
const updateTimetable = async (req, res) => {
  try {
    const { slots, config } = req.body;
    
    let timetable = await Timetable.findOne({ user: req.userId });
    
    if (timetable) {
      timetable.slots = slots;
      if (config) timetable.config = config;
      await timetable.save();
    } else {
      timetable = new Timetable({
        user: req.userId,
        slots,
        config: config || { periodsPerDay: 5 }
      });
      await timetable.save();
    }
    
    res.json({
      message: 'Timetable updated',
      timetable
    });
  } catch (error) {
    console.error('Update teacher timetable error:', error);
    res.status(500).json({ error: 'Failed to update timetable' });
  }
};

/**
 * Get office hours
 * Office hours are stored as specific slots in the timetable marked with subject: 'Office Hours'
 * GET /api/teacher/office-hours
 */
const getOfficeHours = async (req, res) => {
  try {
    const timetable = await Timetable.findOne({ user: req.userId });
    
    if (!timetable) {
      return res.json({ officeHours: [] });
    }
    
    // Filter slots that are marked as office hours
    const officeHours = timetable.slots.filter(
      slot => slot.subject === 'Office Hours'
    );
    
    res.json({ officeHours });
  } catch (error) {
    console.error('Get office hours error:', error);
    res.status(500).json({ error: 'Failed to get office hours' });
  }
};

/**
 * Update office hours
 * POST /api/teacher/office-hours
 */
const updateOfficeHours = async (req, res) => {
  try {
    const { officeHours } = req.body;
    
    let timetable = await Timetable.findOne({ user: req.userId });
    
    if (!timetable) {
      timetable = new Timetable({
        user: req.userId,
        slots: [],
        config: { periodsPerDay: 5 }
      });
    }
    
    // Remove existing office hours
    timetable.slots = timetable.slots.filter(
      slot => slot.subject !== 'Office Hours'
    );
    
    // Add new office hours
    const officeHourSlots = officeHours.map(slot => ({
      ...slot,
      subject: 'Office Hours',
      room: slot.room || 'Faculty Office'
    }));
    
    timetable.slots.push(...officeHourSlots);
    await timetable.save();
    
    res.json({
      message: 'Office hours updated',
      officeHours: officeHourSlots
    });
  } catch (error) {
    console.error('Update office hours error:', error);
    res.status(500).json({ error: 'Failed to update office hours' });
  }
};

/**
 * Get all teachers (for students to browse)
 * GET /api/teacher/all
 * Note: This endpoint is publicly accessible
 */
const getAllTeachers = async (req, res) => {
  try {
    const { search, department } = req.query;
    
    const query = { role: 'TEACHER', status: 'ACTIVE' };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { department: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (department) {
      query.department = department;
    }
    
    const teachers = await User.find(query)
      .select('name email department cabin phone avatar')
      .sort({ name: 1 });
    
    res.json({ teachers });
  } catch (error) {
    console.error('Get all teachers error:', error);
    res.status(500).json({ error: 'Failed to get teachers' });
  }
};

/**
 * Get specific teacher's availability (for students)
 * GET /api/teacher/:teacherId/availability
 */
const getTeacherAvailability = async (req, res) => {
  try {
    const { teacherId } = req.params;
    
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'TEACHER') {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    const timetable = await Timetable.findOne({ user: teacherId });
    
    if (!timetable) {
      return res.json({
        teacher: teacher.toPublicJSON(),
        availability: null,
        officeHours: []
      });
    }
    
    // Get availability for each day
    const availability = {};
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    
    for (const day of days) {
      availability[day] = timetable.getFreeSlotsForDay(day);
    }
    
    // Get office hours
    const officeHours = timetable.slots.filter(
      slot => slot.subject === 'Office Hours'
    );
    
    res.json({
      teacher: teacher.toPublicJSON(),
      availability,
      officeHours,
      periodTimings: timetable.config.periodTimings
    });
  } catch (error) {
    console.error('Get teacher availability error:', error);
    res.status(500).json({ error: 'Failed to get availability' });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getTimetable,
  updateTimetable,
  getOfficeHours,
  updateOfficeHours,
  getAllTeachers,
  getTeacherAvailability
};
