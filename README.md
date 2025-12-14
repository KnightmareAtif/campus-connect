# 🎓 CampusConnect – University Collaboration Platform

CampusConnect is a full-stack web application designed to streamline communication, scheduling, and engagement within a university campus.  
It supports **multiple user roles** — Students, Teachers, Clubs, and Admin — each with tailored dashboards and permissions.

---

## 🚀 Project Overview

CampusConnect helps students:
- Know when their friends are free based on timetables
- Coordinate group meetings efficiently
- Access teacher availability and cabin details
- Stay updated with club events and activities

Teachers can:
- Manage their teaching timetable
- Share office hours and availability
- Make their contact and cabin information easily accessible

Clubs can:
- Post events
- Gain followers
- Share updates with interested students

Admins ensure:
- Platform safety
- User moderation
- System control

---

## 👥 User Roles & Features

### 👨‍🎓 Student
- Upload and manage weekly timetable
- Add friends and view their availability
- Create groups and chat
- View teacher details (cabin, timetable, office hours)
- Follow clubs and get event updates

### 👩‍🏫 Teacher
- Upload teaching timetable
- Define office hours
- Share contact information and cabin number
- Allow students to view availability

### 🏛️ Club
- Maintain club profile
- Post events (date, time, venue)
- Gain followers
- Manage past and upcoming events

### 🛡️ Admin
- View all users
- Block / unblock users
- Delete users
- Moderate platform content

---

## 🧱 Tech Stack

### Frontend
- React + Vite
- TypeScript
- Tailwind CSS
- React Router

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Role-Based Access Control (RBAC)

---

## 🗄️ Database Design (MongoDB)

### Collections
- `users`
- `students`
- `teachers`
- `clubs`
- `timetables`
- `friends`
- `groups`
- `messages`
- `events`
- `followers`

---

## 🧠 Core Logic Highlight

### Free Period Detection
- System checks current day & period
- Matches timetable entries
- Shows real-time availability:
  - 🟢 Free
  - 🔴 Busy
- Group-level availability summary:
  > “3 out of 5 members are free now”

This is the **key innovation** of the project.

---

## 🔐 Authentication & Authorization

- JWT-based authentication
- Role stored in token
- Protected routes for:
  - `/student/*`
  - `/teacher/*`
  - `/club/*`
  - `/admin/*`
- Admin-only privileges for destructive actions

---

## ⚙️ Backend Setup (MongoDB Atlas)

1. Create a MongoDB Atlas cluster
2. Whitelist IP (`0.0.0.0/0` for development)
3. Create a database user
4. Add connection string to `.env`:

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/campusconnect
JWT_SECRET=your_secret_key
PORT=5000
```

## ▶️ Running the Project Locally

### Frontend
```bash
cd frontend
npm install
npm run dev
```


### Backend
```bash
cd backend
npm install
npm start
```
