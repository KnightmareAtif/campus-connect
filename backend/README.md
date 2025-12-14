# Campus Connect API

A RESTful API for a campus web application built with Node.js, Express.js, and MongoDB.

## Features

- **Authentication**: JWT-based auth with role-based access control
- **Students**: Timetable management, friends, groups, messaging
- **Teachers**: Profile, teaching schedule, office hours
- **Clubs**: Event posting, follower management
- **Admin**: User management, event moderation, statistics

## Quick Start

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)

### Installation

```bash
cd backend
npm install
```

### Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your values:
   ```
   MONGODB_URI=mongodb://localhost:27017/campus-hub
   JWT_SECRET=your-secret-key
   ```

### Run

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get profile |
| PUT | `/api/auth/me` | Update profile |

### Student Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/student/timetable` | Get timetable |
| POST | `/api/student/timetable` | Update timetable |
| GET | `/api/student/friends` | Get friends |
| POST | `/api/student/friends/request/:userId` | Send request |
| POST | `/api/student/friends/accept/:requestId` | Accept request |
| GET | `/api/student/groups` | Get groups |
| POST | `/api/student/groups` | Create group |
| POST | `/api/student/groups/:groupId/messages` | Send message |

### Teacher Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teacher/all` | List all teachers |
| GET | `/api/teacher/:id/availability` | Get availability |
| POST | `/api/teacher/timetable` | Update timetable |
| POST | `/api/teacher/office-hours` | Update office hours |

### Club Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/club/all` | List all clubs |
| GET | `/api/club/events/upcoming` | Get events |
| POST | `/api/club/:clubId/follow` | Follow club |
| POST | `/api/club/events` | Create event |

### Admin Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/users` | List users |
| POST | `/api/admin/users/:id/block` | Block user |
| DELETE | `/api/admin/users/:id` | Delete user |
| DELETE | `/api/admin/events/:id` | Delete event |
| GET | `/api/admin/stats` | Get statistics |

## Project Structure

```
backend/
├── config/
│   ├── constants.js    # App constants
│   └── db.js           # DB connection
├── controllers/
│   ├── auth.controller.js
│   ├── student.controller.js
│   ├── teacher.controller.js
│   ├── club.controller.js
│   └── admin.controller.js
├── middleware/
│   ├── auth.middleware.js      # JWT & role auth
│   └── validation.middleware.js # Input validation
├── models/
│   ├── User.js
│   ├── Timetable.js
│   ├── FriendRequest.js
│   ├── Group.js
│   ├── Message.js
│   └── Event.js
├── routes/
│   ├── auth.routes.js
│   ├── student.routes.js
│   ├── teacher.routes.js
│   ├── club.routes.js
│   └── admin.routes.js
├── .env.example
├── package.json
├── README.md
└── server.js
```

## Deployment

Deploy to Railway, Render, Heroku, or any Node.js hosting:

1. Set environment variables
2. Ensure MongoDB connection string is correct
3. Run `npm start`

## License

MIT
