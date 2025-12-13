// Mock data for the campus application

export interface TimeSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  period: number;
  subject: string | null;
  room?: string;
  teacher?: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'free' | 'busy' | 'offline';
  currentActivity?: string;
  freePeriodsToday: number[];
  nextFreeTime?: string;
}

export interface Group {
  id: string;
  name: string;
  type: 'study' | 'project';
  members: Friend[];
  membersOnline: number;
  lastMessage?: {
    sender: string;
    content: string;
    timestamp: Date;
  };
}

export interface Message {
  id: string;
  groupId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  cabin: string;
  email: string;
  phone: string;
  avatar: string;
  officeHours: string[];
  timetable: TimeSlot[];
}

export interface Club {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  avatar: string;
  isFollowing: boolean;
  category: string;
}

export interface Event {
  id: string;
  clubId: string;
  clubName: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  venue: string;
  isFollowedClub: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'club' | 'admin';
  status: 'active' | 'blocked';
  joinedDate: Date;
  avatar: string;
}

// Student Timetable
export const studentTimetable: TimeSlot[] = [
  { id: '1', day: 'Monday', period: 1, subject: 'Mathematics', room: 'Room 101', teacher: 'Dr. Smith' },
  { id: '2', day: 'Monday', period: 2, subject: 'Physics', room: 'Lab 1', teacher: 'Prof. Johnson' },
  { id: '3', day: 'Monday', period: 3, subject: null },
  { id: '4', day: 'Monday', period: 4, subject: 'Computer Science', room: 'Room 205', teacher: 'Dr. Miller' },
  { id: '5', day: 'Monday', period: 5, subject: null },
  { id: '6', day: 'Tuesday', period: 1, subject: null },
  { id: '7', day: 'Tuesday', period: 2, subject: 'Chemistry', room: 'Lab 2', teacher: 'Dr. Wilson' },
  { id: '8', day: 'Tuesday', period: 3, subject: 'English', room: 'Room 102', teacher: 'Ms. Davis' },
  { id: '9', day: 'Tuesday', period: 4, subject: null },
  { id: '10', day: 'Tuesday', period: 5, subject: 'Mathematics', room: 'Room 101', teacher: 'Dr. Smith' },
  { id: '11', day: 'Wednesday', period: 1, subject: 'Physics', room: 'Lab 1', teacher: 'Prof. Johnson' },
  { id: '12', day: 'Wednesday', period: 2, subject: null },
  { id: '13', day: 'Wednesday', period: 3, subject: 'Computer Science', room: 'Room 205', teacher: 'Dr. Miller' },
  { id: '14', day: 'Wednesday', period: 4, subject: 'Chemistry', room: 'Lab 2', teacher: 'Dr. Wilson' },
  { id: '15', day: 'Wednesday', period: 5, subject: null },
  { id: '16', day: 'Thursday', period: 1, subject: 'English', room: 'Room 102', teacher: 'Ms. Davis' },
  { id: '17', day: 'Thursday', period: 2, subject: 'Mathematics', room: 'Room 101', teacher: 'Dr. Smith' },
  { id: '18', day: 'Thursday', period: 3, subject: null },
  { id: '19', day: 'Thursday', period: 4, subject: null },
  { id: '20', day: 'Thursday', period: 5, subject: 'Physics', room: 'Lab 1', teacher: 'Prof. Johnson' },
  { id: '21', day: 'Friday', period: 1, subject: null },
  { id: '22', day: 'Friday', period: 2, subject: 'Computer Science', room: 'Room 205', teacher: 'Dr. Miller' },
  { id: '23', day: 'Friday', period: 3, subject: 'Chemistry', room: 'Lab 2', teacher: 'Dr. Wilson' },
  { id: '24', day: 'Friday', period: 4, subject: 'English', room: 'Room 102', teacher: 'Ms. Davis' },
  { id: '25', day: 'Friday', period: 5, subject: null },
];

export const friends: Friend[] = [
  { id: '1', name: 'Emma Wilson', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', status: 'free', currentActivity: 'Library', freePeriodsToday: [3, 5], nextFreeTime: 'Now' },
  { id: '2', name: 'James Brown', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', status: 'busy', currentActivity: 'Chemistry Lab', freePeriodsToday: [4, 5], nextFreeTime: '2:00 PM' },
  { id: '3', name: 'Sophie Chen', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie', status: 'free', currentActivity: 'Cafeteria', freePeriodsToday: [1, 3, 5], nextFreeTime: 'Now' },
  { id: '4', name: 'Michael Lee', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael', status: 'offline', freePeriodsToday: [2, 4], nextFreeTime: 'Tomorrow' },
  { id: '5', name: 'Olivia Taylor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia', status: 'busy', currentActivity: 'Math Class', freePeriodsToday: [5], nextFreeTime: '3:00 PM' },
  { id: '6', name: 'Daniel Kim', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel', status: 'free', currentActivity: 'Student Center', freePeriodsToday: [1, 2, 5], nextFreeTime: 'Now' },
];

export const groups: Group[] = [
  {
    id: '1',
    name: 'CS Project Team',
    type: 'project',
    members: [friends[0], friends[1], friends[2]],
    membersOnline: 2,
    lastMessage: { sender: 'Emma', content: 'Meeting at 3pm today?', timestamp: new Date() },
  },
  {
    id: '2',
    name: 'Math Study Group',
    type: 'study',
    members: [friends[2], friends[4], friends[5]],
    membersOnline: 3,
    lastMessage: { sender: 'Sophie', content: 'Can someone explain Chapter 5?', timestamp: new Date() },
  },
  {
    id: '3',
    name: 'Physics Lab Partners',
    type: 'project',
    members: [friends[1], friends[3]],
    membersOnline: 1,
    lastMessage: { sender: 'James', content: 'Lab report submitted!', timestamp: new Date() },
  },
];

export const groupMessages: Message[] = [
  { id: '1', groupId: '1', senderId: '1', senderName: 'Emma Wilson', content: 'Hey everyone! Ready for the project meeting?', timestamp: new Date(Date.now() - 3600000) },
  { id: '2', groupId: '1', senderId: '2', senderName: 'James Brown', content: 'Yes! I finished the database schema.', timestamp: new Date(Date.now() - 3000000) },
  { id: '3', groupId: '1', senderId: '3', senderName: 'Sophie Chen', content: 'Great work! I\'ll review it after class.', timestamp: new Date(Date.now() - 2400000) },
  { id: '4', groupId: '1', senderId: '1', senderName: 'Emma Wilson', content: 'Meeting at 3pm today?', timestamp: new Date(Date.now() - 1800000) },
];

export const teachers: Teacher[] = [
  {
    id: '1',
    name: 'Dr. Robert Smith',
    subject: 'Mathematics',
    cabin: 'Faculty Block A, Room 12',
    email: 'r.smith@campus.edu',
    phone: '+1 (555) 123-4567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    officeHours: ['Monday 10-12', 'Wednesday 2-4', 'Friday 10-11'],
    timetable: [],
  },
  {
    id: '2',
    name: 'Prof. Lisa Johnson',
    subject: 'Physics',
    cabin: 'Science Block, Room 5',
    email: 'l.johnson@campus.edu',
    phone: '+1 (555) 234-5678',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    officeHours: ['Tuesday 11-1', 'Thursday 3-5'],
    timetable: [],
  },
  {
    id: '3',
    name: 'Dr. Sarah Miller',
    subject: 'Computer Science',
    cabin: 'Tech Building, Room 301',
    email: 's.miller@campus.edu',
    phone: '+1 (555) 345-6789',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahM',
    officeHours: ['Monday 2-4', 'Wednesday 10-12', 'Friday 2-3'],
    timetable: [],
  },
  {
    id: '4',
    name: 'Dr. Mark Wilson',
    subject: 'Chemistry',
    cabin: 'Science Block, Room 8',
    email: 'm.wilson@campus.edu',
    phone: '+1 (555) 456-7890',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mark',
    officeHours: ['Tuesday 9-11', 'Thursday 1-3'],
    timetable: [],
  },
  {
    id: '5',
    name: 'Ms. Emily Davis',
    subject: 'English',
    cabin: 'Humanities Block, Room 22',
    email: 'e.davis@campus.edu',
    phone: '+1 (555) 567-8901',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    officeHours: ['Monday 11-1', 'Friday 9-11'],
    timetable: [],
  },
];

export const clubs: Club[] = [
  { id: '1', name: 'Tech Club', description: 'Explore the latest in technology, coding, and innovation.', memberCount: 156, avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Tech', isFollowing: true, category: 'Technology' },
  { id: '2', name: 'Photography Society', description: 'Capture moments and learn professional photography skills.', memberCount: 89, avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Photo', isFollowing: false, category: 'Arts' },
  { id: '3', name: 'Debate Club', description: 'Sharpen your argumentation and public speaking skills.', memberCount: 72, avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Debate', isFollowing: true, category: 'Academic' },
  { id: '4', name: 'Music Society', description: 'From classical to contemporary, express yourself through music.', memberCount: 134, avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Music', isFollowing: false, category: 'Arts' },
  { id: '5', name: 'Sports Club', description: 'Stay fit and compete in various sports activities.', memberCount: 245, avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Sports', isFollowing: false, category: 'Sports' },
  { id: '6', name: 'Entrepreneurship Cell', description: 'Turn your ideas into reality with mentorship and resources.', memberCount: 98, avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Entrepreneur', isFollowing: true, category: 'Business' },
];

export const events: Event[] = [
  { id: '1', clubId: '1', clubName: 'Tech Club', title: 'Hackathon 2024', description: '24-hour coding competition with amazing prizes!', date: new Date(Date.now() + 86400000 * 3), time: '9:00 AM', venue: 'Tech Auditorium', isFollowedClub: true },
  { id: '2', clubId: '3', clubName: 'Debate Club', title: 'Inter-College Debate', description: 'Annual debate competition with teams from 10 colleges.', date: new Date(Date.now() + 86400000 * 5), time: '2:00 PM', venue: 'Main Hall', isFollowedClub: true },
  { id: '3', clubId: '2', clubName: 'Photography Society', title: 'Photo Walk', description: 'Explore campus through your lens with expert guidance.', date: new Date(Date.now() + 86400000 * 7), time: '6:00 AM', venue: 'Campus Gate', isFollowedClub: false },
  { id: '4', clubId: '6', clubName: 'Entrepreneurship Cell', title: 'Startup Pitch Day', description: 'Present your startup ideas to real investors!', date: new Date(Date.now() + 86400000 * 10), time: '10:00 AM', venue: 'Business School', isFollowedClub: true },
  { id: '5', clubId: '4', clubName: 'Music Society', title: 'Annual Concert', description: 'A night of musical performances by student bands.', date: new Date(Date.now() + 86400000 * 14), time: '6:00 PM', venue: 'Open Air Theatre', isFollowedClub: false },
];

export const adminUsers: AdminUser[] = [
  { id: '1', name: 'Alex Johnson', email: 'alex.j@campus.edu', role: 'student', status: 'active', joinedDate: new Date('2023-08-15'), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex' },
  { id: '2', name: 'Emma Wilson', email: 'emma.w@campus.edu', role: 'student', status: 'active', joinedDate: new Date('2023-08-20'), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma' },
  { id: '3', name: 'Dr. Sarah Miller', email: 's.miller@campus.edu', role: 'teacher', status: 'active', joinedDate: new Date('2022-01-10'), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahM' },
  { id: '4', name: 'Tech Club', email: 'techclub@campus.edu', role: 'club', status: 'active', joinedDate: new Date('2021-09-01'), avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Tech' },
  { id: '5', name: 'James Brown', email: 'james.b@campus.edu', role: 'student', status: 'blocked', joinedDate: new Date('2023-09-05'), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James' },
  { id: '6', name: 'Prof. Lisa Johnson', email: 'l.johnson@campus.edu', role: 'teacher', status: 'active', joinedDate: new Date('2020-08-15'), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa' },
  { id: '7', name: 'Photography Society', email: 'photo@campus.edu', role: 'club', status: 'active', joinedDate: new Date('2022-03-20'), avatar: 'https://api.dicebear.com/7.x/shapes/svg?seed=Photo' },
  { id: '8', name: 'Michael Lee', email: 'michael.l@campus.edu', role: 'student', status: 'active', joinedDate: new Date('2023-08-25'), avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael' },
];

export const periodTimes = [
  '8:00 AM - 9:00 AM',
  '9:00 AM - 10:00 AM',
  '10:30 AM - 11:30 AM',
  '11:30 AM - 12:30 PM',
  '2:00 PM - 3:00 PM',
];
