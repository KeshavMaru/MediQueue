# MediQueue - Medical Appointment Booking System

**A role-based appointment booking platform connecting patients with doctors for seamless healthcare scheduling.**

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Setup Instructions](#setup-instructions)
6. [Running the Project](#running-the-project)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [Assumptions](#assumptions)
10. [Known Limitations](#known-limitations)
11. [Deployment Guide](#deployment-guide)
12. [Troubleshooting](#troubleshooting)

---

## 🎯 Project Overview

**MediQueue** is a comprehensive appointment booking system designed for healthcare providers and patients. It enables:

- **Patients** to browse doctors, book appointments, view their appointments, and cancel bookings
- **Doctors** to manage their appointment slots, accept/decline booking requests, and view patient details
- **Admins** to manage both patients and doctors (CRUD operations)

The system automates slot generation for doctors (next 3 days, excluding Sundays, with lunch breaks) and manages booking workflows with proper authorization checks.

---

## ✨ Features

### Patient Features
- 🔐 Sign up and login with email/password
- 👨‍⚕️ Browse available doctors with specialization and experience
- 📅 View available appointment slots
- ✅ Book appointments with doctors
- 📋 View "My Appointments" with status and patient details
- ❌ Cancel booked appointments anytime
- 🔒 Role-based access control

### Doctor Features
- 🔐 Sign up with professional details (specialization, experience, daily hours, slot duration)
- 🏥 Auto-generate appointment slots on registration
- ⚙️ Manually generate slots for next 3 days (skip Sundays)
- 🍽️ Automatic 1-hour lunch break (12:00–13:00) during slot generation
- 📊 View all slots with booking status
- 👤 See patient names and contact on booked slots
- ✅ Accept or decline booking requests
- 🔒 Only doctor-owner can manage their own slots

### Admin Features
- 🔐 Hardcoded admin login (email: `admin`, password: `admin123`)
- 👥 View all patients with details
- 👨‍⚕️ View all doctors with details
- ✏️ Edit patient and doctor information
- 🗑️ Delete patients and doctors
- 📊 Inline forms for quick CRUD operations

### System Features
- 🔐 JWT-based authentication
- 🎯 Role-based authorization (patient, doctor, admin)
- 🔒 Protected API endpoints
- 📱 Responsive UI with Vite + React + TypeScript
- 🗄️ PostgreSQL with migrations
- ⏰ Automatic booking expiration (PENDING status → FAILED after 120 seconds)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Inline CSS + responsive design
- **Routing**: React Router v6
- **State Management**: Context API (AuthContext, DoctorsContext)
- **HTTP Client**: Fetch API

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Task Scheduler**: setInterval (for expiry worker)
- **Environment**: dotenv
- **ORM**: None (raw SQL with pg library)

### Database
- **Type**: PostgreSQL
- **Client**: `pg` npm package
- **Migrations**: SQL files with run script

### DevOps / Deployment (Optional)
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway / Render / Fly.io
- **Database Hosting**: Supabase (free Postgres)
- **Version Control**: GitHub

---

## 🏗️ Architecture

### Folder Structure

```
Medique/
├── backend/
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── bookingController.js
│   │   │   ├── doctorController.js
│   │   ├── routes/             # API route definitions
│   │   │   ├── auth.js
│   │   │   ├── admin.js
│   │   │   ├── doctors.js
│   │   │   ├── bookings.js
│   │   ├── middleware/         # Express middleware
│   │   │   └── auth.js         # JWT verification & role checks
│   │   ├── services/           # Business logic
│   │   │   ├── authService.js  # Auth, signup, login
│   │   │   └── slotService.js  # Slot generation logic
│   │   ├── controllers/
│   │   │   ├── bookingController.js
│   │   │   ├── doctorController.js
│   │   ├── db/                 # Database connection
│   │   │   └── index.js
│   │   ├── migrations/         # SQL migration files
│   │   │   ├── 001_create_tables.sql
│   │   │   ├── 002_create_users_and_sessions.sql
│   │   │   ├── 003_add_user_type.sql
│   │   │   ├── 004_link_doctors_to_users.sql
│   │   │   ├── 005_add_patient_user_to_bookings.sql
│   │   │   └── run_migrations.js
│   │   ├── seeds/              # Seed data & helper scripts
│   │   │   ├── seed_users.js
│   │   │   ├── update_patient_passwords.js
│   │   │   └── inspect_users.js
│   │   ├── jobs/               # Background jobs
│   │   │   └── expiryWorker.js # Expiry task
│   │   └── index.js            # Express app entry point
│   ├── .env                    # Environment variables (local)
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── Home.tsx        # Doctor/Patient home
│   │   │   ├── RoleSelection.tsx
│   │   │   ├── DoctorLogin.tsx
│   │   │   ├── DoctorSignup.tsx
│   │   │   ├── PatientLogin.tsx
│   │   │   ├── PatientSignup.tsx
│   │   │   ├── Admin.tsx       # Admin CRUD dashboard
│   │   │   ├── AdminLogin.tsx
│   │   │   ├── DoctorPage.tsx  # Doctor slot management
│   │   │   ├── MyAppointments.tsx # Patient appointments
│   │   │   ├── BookingStatus.tsx
│   │   ├── components/         # Reusable components
│   │   │   ├── DoctorCard.tsx  # Doctor list item
│   │   │   └── SlotGrid.tsx    # Slot display grid
│   │   ├── contexts/           # Context providers
│   │   │   ├── AuthContext.tsx
│   │   │   └── DoctorsContext.tsx
│   │   ├── api/                # API helper functions
│   │   │   └── api.ts
│   │   ├── App.tsx             # Main app with routing
│   │   ├── App.css
│   │   ├── main.tsx
│   │   └── index.css
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── index.html
├── docker-compose.yml          # Local Postgres container
├── .gitignore
├── README.md                   # This file
```

### Data Flow

```
User (Browser)
    ↓
Vite Frontend (React + TypeScript)
    ↓ (API calls via fetch)
Express Backend (Node.js)
    ↓ (queries, migrations)
PostgreSQL Database
    ↓
DoctorsContext / AuthContext (localStorage tokens)
```

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** >= 16 (install from [nodejs.org](https://nodejs.org))
- **PostgreSQL** >= 12 (local or Docker)
- **Docker** (optional, for local Postgres via docker-compose)
- **Git** (for cloning the repo)
- **npm** or **yarn** (comes with Node.js)

### Local Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/Medique.git
cd Medique
```

#### 2. Set Up PostgreSQL

**Option A: Using Docker (Recommended)**

```bash
# Start Postgres in Docker
docker-compose up -d

# Verify container is running
docker ps
```

**Option B: Local PostgreSQL**

Create a local database:

```bash
psql -U postgres
CREATE DATABASE mediqueue_dev;
\q
```

#### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file (copy from example or use the one provided)
# Ensure DATABASE_URL is set to your Postgres connection
# cat .env should show:
# DATABASE_URL=postgres://postgres:postgres@localhost:5432/mediqueue_dev
# PORT=4000
# BOOKING_PENDING_TTL_SECONDS=120
# JWT_SECRET=your-secret-key (defaults to 'change_me_in_production')

# Run migrations
node src/migrations/run_migrations.js

# (Optional) Seed sample data
node src/seeds/seed_users.js
```

#### 4. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env.local (Vite will pick it up)
# VITE_API_URL=http://localhost:4000
```

#### 5. Run Locally

**Terminal 1: Backend**

```bash
cd backend
npm start
# or with auto-reload:
npm run dev
```

Backend runs on `http://localhost:4000`

**Terminal 2: Frontend**

```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:5173` (Vite default)

**Terminal 3: (Optional) Database**

If using Docker:

```bash
# Keep the container running or run in background
docker-compose up -d
```

#### 6. Access the App

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:4000](http://localhost:4000)
- **Database**: `localhost:5432` (psql or DBeaver)

---

## 🏃 Running the Project

### Quick Start

```bash
# From project root:
# Start backend
cd backend && npm start &

# Start frontend (in another terminal)
cd frontend && npm run dev

# Ensure Postgres is running (Docker or local)
```

### Available Scripts

#### Backend

```bash
npm start                # Run in production mode
npm run dev              # Run with nodemon (auto-reload)
node src/migrations/run_migrations.js  # Run all migrations
node src/seeds/seed_users.js           # Seed sample data
```

#### Frontend

```bash
npm run dev              # Start Vite dev server
npm run build            # Build for production (creates dist/)
npm run preview          # Preview production build locally
npm run lint             # ESLint (if configured)
```

### Test Credentials (After Seeding)

**Patients:**
- Email: `amit.sharma@gmail.com` | Password: `patient123`
- Email: `neha.sharma@gmail.com` | Password: `patient123`
- Email: `rohan.singh@gmail.com` | Password: `patient123`

**Doctors:** (Register via signup or seed script)
- See `backend/src/seeds/seed_users.js` for examples

**Admin:**
- Email: `admin` | Password: `admin123` (hardcoded in frontend)

---

## 📚 API Documentation

### Base URL

- **Local**: `http://localhost:4000`
- **Production**: `https://your-backend-url.com`

### Authentication

All protected endpoints require:

```
Authorization: Bearer <accessToken>
Content-Type: application/json
```

### Endpoints

#### Auth Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/signup` | Register a new user | ❌ |
| POST | `/auth/login` | Login & get tokens | ❌ |
| GET | `/auth/me` | Get current user | ✅ |
| POST | `/auth/logout` | Logout & revoke tokens | ✅ |

**Signup Request (Patient):**

```json
{
  "email": "patient@example.com",
  "password": "pass123",
  "full_name": "John Patient",
  "user_type": "patient"
}
```

**Signup Request (Doctor):**

```json
{
  "email": "doctor@example.com",
  "password": "doc123",
  "full_name": "Dr. Jane",
  "user_type": "doctor",
  "doctor_details": {
    "specialization": "Cardiology",
    "experienceYears": 5,
    "dailyStartTime": "09:00:00",
    "dailyEndTime": "17:00:00",
    "slotDurationMinutes": 15
  }
}
```

#### Doctor Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/doctors` | List all doctors | ❌ |
| GET | `/doctors/:id` | Get doctor details | ❌ |
| GET | `/doctors/:id/slots` | Get slots for doctor | ✅ |
| POST | `/doctors/:id/generate-slots` | Generate 3-day slots | ✅ Doctor-owner only |
| POST | `/doctors` | Create doctor (admin) | ✅ Admin |

#### Booking Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/bookings/book` | Create booking (patient) | ✅ Patient only |
| GET | `/bookings/my` | Get patient's bookings | ✅ Patient |
| GET | `/bookings/:id` | Get booking details | ❌ |
| DELETE | `/bookings/:id` | Cancel booking (patient) | ✅ Patient-owner |
| PATCH | `/bookings/:id` | Accept/decline booking (doctor) | ✅ Doctor-owner |

**Booking Request:**

```json
{
  "doctor_id": "uuid-of-doctor",
  "slot_id": "uuid-of-slot",
  "patient_name": "Patient Name",
  "patient_contact": "phone-number"
}
```

**Doctor Response:**

```json
{
  "action": "accept"  // or "decline"
}
```

#### Admin Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/admin/patients` | List all patients | ✅ Admin |
| GET | `/admin/doctors` | List all doctors | ✅ Admin |
| PUT | `/admin/patients/:id` | Update patient | ✅ Admin |
| PUT | `/admin/doctors/:id` | Update doctor | ✅ Admin |
| DELETE | `/admin/patients/:id` | Delete patient | ✅ Admin |
| DELETE | `/admin/doctors/:id` | Delete doctor | ✅ Admin |

### Full Postman Collection

A Postman collection is provided in the repository:

**File**: `Medique.postman_collection.json`

**Steps to import:**
1. Open Postman
2. Click **Import** → **File**
3. Select `Medique.postman_collection.json`
4. Collections are organized by auth, doctors, bookings, admin
5. Update `{{BASE_URL}}` variable (default: `http://localhost:4000`)
6. Tests include response validation and status checks

**Download**: [Medique.postman_collection.json](./Medique.postman_collection.json)

---

## 🗄️ Database Schema

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',         -- 'user' or 'admin'
  user_type VARCHAR(50) NOT NULL,          -- 'patient' or 'doctor'
  is_active BOOLEAN DEFAULT true,
  is_email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Doctors Table

```sql
CREATE TABLE doctors (
  id UUID PRIMARY KEY,
  user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  specialization TEXT,
  experience_years INT,
  daily_start_time TIME,
  daily_end_time TIME,
  slot_duration_minutes INT DEFAULT 15,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### Slots Table

```sql
CREATE TABLE slots (
  id UUID PRIMARY KEY,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  slot_time TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'AVAILABLE',  -- 'AVAILABLE', 'HOLD', 'BOOKED'
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (doctor_id, slot_time)
);
```

### Bookings Table

```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY,
  doctor_id UUID NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  slot_id UUID NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
  patient_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  patient_name TEXT NOT NULL,
  patient_contact TEXT,
  status TEXT DEFAULT 'PENDING',    -- 'PENDING', 'CONFIRMED', 'DECLINED', 'CANCELLED', 'FAILED'
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  meta JSONB DEFAULT '{}'::jsonb
);
```

### Sessions Table

```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token_hash VARCHAR(255) NOT NULL,
  user_agent TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL
);
```

### Entity Relationships

```
users (1) ---> (many) doctors
users (1) ---> (many) sessions
users (1) ---> (many) bookings (as patient_user_id)

doctors (1) ---> (many) slots
doctors (1) ---> (many) bookings

slots (1) ---> (many) bookings
```

---

## 📝 Assumptions

1. **Email Uniqueness**: Email addresses are unique per user; no duplicate signups allowed.
2. **JWT Secret**: `JWT_SECRET` defaults to `'change_me_in_production'` — must be changed in production.
3. **Database URL**: Connection string is passed via `DATABASE_URL` environment variable.
4. **Time Zone**: All timestamps are stored in UTC (TIMESTAMPTZ); display is adjusted client-side.
5. **Slot Generation**: Always generates for next 3 calendar days, skipping Sundays, with a fixed 12:00–13:00 lunch break.
6. **Booking TTL**: Pending bookings auto-expire after 120 seconds (configurable via `BOOKING_PENDING_TTL_SECONDS`).
7. **Admin Access**: Hardcoded admin login (email: `admin`, password: `admin123`) for development; should be replaced with proper admin registration in production.
8. **Patient Name**: Stored from signup; can be updated by patient or doctor.
9. **CORS**: Frontend and backend must have matching origins; CORS is enabled in backend middleware.
10. **Localhost Assumption**: Dev setup assumes Postgres runs on `localhost:5432`; configurable via `.env`.
11. **User Types are Immutable**: Once signed up as patient/doctor, type cannot be changed.
12. **No Email Verification**: Email verification is not implemented; registration is immediate.
13. **No Password Reset**: Forgot-password flow is not implemented.
14. **Slots are Public**: All slot details are publicly accessible; only booking is protected.
15. **No Multi-Language**: UI is in English only.

---

## ⚠️ Known Limitations

1. **Admin Hardcoded Credentials**: Admin login uses hardcoded email/password instead of secure registration.
2. **No Payment Integration**: Appointments are free; no payment/billing system implemented.
3. **No Email Notifications**: Booking confirmations/cancellations are not emailed; users check the app.
4. **No SMS Reminders**: Patients don't receive SMS appointment reminders.
5. **No Video Consultation**: Appointments are in-clinic only; no virtual consultation links.
6. **No Ratings/Reviews**: Patients cannot rate doctors or write reviews.
7. **No Availability Blocks**: Doctors cannot manually block time slots (e.g., for breaks).
8. **No Recurring Slots**: Slots are generated once per signup; no continuous weekly generation.
9. **No Waitlist**: If all slots are booked, patients cannot join a waitlist.
10. **No Multi-Doctor Groups**: Only individual doctor profiles; no group practices.
11. **No Insurance Integration**: No insurance provider lookup or coverage checks.
12. **No Audit Logs**: Admin actions are not logged; no audit trail for compliance.
13. **Limited Error Messages**: API errors are generic; no detailed error codes.
14. **No Rate Limiting**: No API rate limiting; susceptible to abuse.
15. **No Two-Factor Auth**: Only email/password; no 2FA supported.
16. **Lunch Break is Fixed**: 1-hour lunch (12:00–13:00) cannot be customized per doctor.
17. **No Doctor Availability Calendar**: Doctors cannot set custom availability; only daily start/end times.
18. **No Slot Buffer Time**: No gap between consecutive bookings (e.g., for cleaning).
19. **No Time Zone Selection**: All times assumed to be local; no timezone conversion.
20. **Frontend Scalability**: Inline styles used instead of CSS modules; harder to scale styling.
21. **No Form Validation UI**: Basic HTML validation; no rich validation feedback.
22. **No Dark Mode**: Light theme only.
23. **Database Backups Not Automated**: Manual backup required; no auto-backup in production.
24. **No Analytics**: No usage metrics, booking stats, or doctor performance data.

---

## 🌐 Deployment Guide

### Option 1: Vercel (Frontend) + Railway (Backend) + Supabase (Database)

#### Step 1: Create Supabase Database

1. Go to [supabase.com](https://supabase.com) → Sign up/Login
2. Create new project → Name: `mediqueue`
3. Note the **Database Connection String** (Connection pooler)
4. In Supabase SQL Editor, paste and run each migration file (001–005)
5. Keep the connection string safe for backend env

#### Step 2: Deploy Backend to Railway

1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select your GitHub repo → Select `backend` folder
3. Set Environment Variables:
   - `DATABASE_URL` = Supabase connection string
   - `PORT` = `4000`
   - `JWT_SECRET` = random 32-char string
   - `NODE_ENV` = `production`
4. Start command: `npm start`
5. Deploy. Railway assigns a public URL (e.g., `https://medique-backend.railway.app`)

#### Step 3: Deploy Frontend to Vercel

1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Select repo → Select `frontend` folder
3. Set Environment Variables:
   - `VITE_API_URL` = `https://medique-backend.railway.app` (your Railway URL)
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Deploy. Vercel assigns a domain (e.g., `mediqueue.vercel.app`)

#### Step 4: Update CORS

In `backend/src/index.js`, update CORS allowed origin:

```javascript
const cors = require('cors');
app.use(cors({
  origin: 'https://mediqueue.vercel.app'
}));
```

Commit and push. Railway/Vercel auto-redeploy.

#### Step 5: Test Production

- Open `https://mediqueue.vercel.app`
- Sign up as doctor/patient
- Check Supabase SQL Editor to verify data is saved
- Verify booking flow end-to-end

### Option 2: Render (All in One)

1. Go to [render.com](https://render.com)
2. Create Web Service → Connect GitHub repo
3. Render can host Node backend directly
4. Set env vars (DATABASE_URL, PORT, JWT_SECRET)
5. Deploy backend
6. Deploy frontend as Static Site
7. Update frontend env to point to backend URL

### Option 3: Self-Hosted (VPS)

1. Rent a VPS (DigitalOcean, AWS EC2, Linode, etc.)
2. Install Node.js, PostgreSQL, Nginx
3. Clone repo → Install deps
4. Run migrations on PostgreSQL
5. Start backend with PM2 (process manager)
6. Build frontend → serve via Nginx (static files)
7. Configure SSL (Let's Encrypt)
8. Point domain via DNS

---

## 🔧 Troubleshooting

### Backend Issues

**Error: "Cannot find module pg"**
```bash
cd backend && npm install
```

**Error: "Database connection refused"**
- Check Postgres is running: `docker ps` or `psql -U postgres`
- Verify `DATABASE_URL` in `.env`
- Example: `postgres://postgres:postgres@localhost:5432/mediqueue_dev`

**Error: "FATAL: password authentication failed"**
- Check Postgres username/password in `.env`
- Default Docker: user=`postgres`, pass=`postgres`

**Slots not generating on doctor signup**
- Check backend logs for errors
- Verify `node src/migrations/run_migrations.js` ran successfully
- Check `slots` table has entries: `SELECT COUNT(*) FROM slots;`

**Admin login not working**
- Frontend admin login is hardcoded: email=`admin`, password=`admin123`
- Check browser console for errors
- Clear localStorage: Open DevTools → Application → LocalStorage → Clear

### Frontend Issues

**Error: "VITE_API_URL is not defined"**
- Create `.env.local` in `frontend/` folder
- Add: `VITE_API_URL=http://localhost:4000`
- Restart frontend dev server

**Error: "Cannot reach backend (CORS error)"**
- Ensure backend is running on `http://localhost:4000`
- Check browser console for error details
- Backend CORS must allow frontend origin

**Page blank or 404**
- Check Vite dev server is running
- Verify `npm run dev` is executed in `frontend/`
- Try `http://localhost:5173` in browser

### Database Issues

**Error: "Relation "users" does not exist"**
- Migrations haven't run
- Execute: `node src/migrations/run_migrations.js`
- Or run SQL files manually in Supabase/psql

**Slots not showing for doctor**
- Check doctor exists in `doctors` table
- Verify `user_id` is set (foreign key to users)
- Check slots exist: `SELECT * FROM slots WHERE doctor_id='<doctor-id>' LIMIT 5;`

**Bookings table missing `patient_user_id` column**
- Migration `005_add_patient_user_to_bookings.sql` not run
- Execute: `node src/migrations/run_migrations.js`

---

## 📦 Deliverables

✅ **Source Code**: Public GitHub repository  
✅ **README.md**: This file (setup, assumptions, limitations, API docs)  
✅ **Docker Compose**: Local Postgres setup (`docker-compose.yml`)  
✅ **Migrations**: 5 SQL migration files for database schema  
✅ **Seed Data**: Sample users, doctors, patients  
✅ **API Documentation**: Full endpoint reference with examples  
✅ **Postman Collection**: JSON file with all API requests  
✅ **Deployment Guide**: Instructions for Vercel, Railway, Supabase  
✅ **Setup Instructions**: Local development quickstart  
✅ **Known Limitations**: Documented 24+ limitations  
✅ **Assumptions**: 15+ documented assumptions  

---

## 📞 Support & Contributions

- **Issues**: Open an issue on GitHub
- **Questions**: Check existing issues or open a discussion
- **Pull Requests**: Welcome! Follow standard Git workflow

---

## 📄 License

This project is provided as-is for educational purposes.

---

## 🎓 Project Summary

**MediQueue** demonstrates a full-stack web application with:
- Role-based authentication & authorization
- Complex business logic (slot generation, booking workflows)
- React + TypeScript frontend with Context API
- Express + PostgreSQL backend with migrations
- Docker-based local development
- Production-ready deployment strategies
- Comprehensive documentation & API design

---

**Last Updated**: December 12, 2025  
**Repository**: [GitHub Link](https://github.com/yourusername/Medique)  
**Live Demo**: (Add your deployed URL here)

---

### Quick Links

- [GitHub Repository](https://github.com/yourusername/Medique)
- [API Documentation](#api-documentation)
- [Setup Guide](#setup-instructions)
- [Deployment Guide](#deployment-guide)
- [Database Schema](#database-schema)

---

**Built with ❤️ using React, Node.js, and PostgreSQL**
