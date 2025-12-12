# 🏥 MediQueue - Complete Authentication System

## Overview

This project now includes a complete, production-ready authentication system with:

✅ **User Registration & Login** - Secure signup and login with bcrypt password hashing
✅ **JWT Authentication** - Access tokens for API requests
✅ **Refresh Tokens** - Long-lived tokens for maintaining sessions
✅ **Role-Based Access Control (RBAC)** - Admin-only routes for doctor and slot management
✅ **Input Validation** - Email and password validation on signup
✅ **Rate Limiting** - Login attempt rate limiting
✅ **Security Headers** - Helmet.js for security best practices
✅ **Protected Routes** - Frontend route protection with auth checks

---

## 📋 Implementation Details

### Backend Architecture

#### Database Schema
- `users` table - Stores user credentials and roles
- `sessions` table - Stores refresh token hashes for token management

#### Authentication Flow

```
1. User Signup → POST /auth/signup
   ├─ Validate input (email, password, name)
   ├─ Hash password with bcrypt (12 rounds)
   └─ Create user record in database

2. User Login → POST /auth/login
   ├─ Validate credentials
   ├─ Compare password hash
   ├─ Create JWT access token (15m expiry)
   ├─ Create refresh token (30-day expiry)
   ├─ Store refresh token hash in sessions table
   └─ Return tokens to frontend

3. Protected API Requests
   ├─ Frontend sends: Authorization: Bearer {accessToken}
   ├─ Middleware validates JWT signature and expiry
   └─ Attach user info to request object

4. User Logout → POST /auth/logout
   ├─ Delete session record (revokes refresh token)
   └─ Frontend clears localStorage tokens

5. Get Current User → GET /auth/me
   ├─ Requires valid access token
   └─ Returns user details
```

#### API Endpoints

**Public Routes:**
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - Authenticate user, receive tokens
- `GET /doctors` - List all doctors
- `GET /doctors/:id/slots` - Get available slots for doctor
- `POST /bookings/book` - Book an appointment

**Protected Routes (Require Valid JWT):**
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user info

**Admin-Only Routes (Require Admin Role):**
- `POST /admin/doctors` - Create new doctor
- `POST /admin/doctors/:id/generate-slots` - Generate appointment slots

#### Security Features

1. **Password Hashing**
   - Uses bcrypt with 12 salt rounds
   - Passwords never stored in plaintext
   - Verified on login using bcrypt.compare()

2. **JWT Tokens**
   - Short-lived access token (15 minutes)
   - Long-lived refresh token (30 days)
   - Tokens signed with JWT_SECRET

3. **Token Storage**
   - Refresh token hash stored in database
   - Only hashes stored, never raw tokens
   - Enables token revocation and validation

4. **Rate Limiting**
   - 5 login attempts per IP per 15 minutes
   - Prevents brute force attacks

5. **Input Validation**
   - Email validation (RFC 5321)
   - Password minimum 8 characters
   - Name validation required

6. **Security Headers**
   - Helmet.js for HTTP security headers
   - CORS restricted to frontend URL
   - No wildcard CORS in production

---

## 🚀 Setup & Installation

### 1. Install Backend Dependencies

```bash
cd backend
npm install
```

### 2. Create Database

```bash
# Update DB_HOST, DB_USER, DB_PASSWORD in .env if needed
psql -U postgres -c "CREATE DATABASE medique;"
```

### 3. Run Database Migrations

```bash
npm run migrate
```

This will create `users` and `sessions` tables.

### 4. Configure Environment Variables

Create `backend/.env` (copy from `.env.example`):

```bash
DATABASE_URL=postgres://postgres:password@localhost:5432/medique
PORT=4000
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key_change_in_production_NOW
FRONTEND_URL=http://localhost:5173
```

**⚠️ IMPORTANT:** Change `JWT_SECRET` to a strong random string in production!

```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Start Backend Server

```bash
npm run dev
```

Server will run on `http://localhost:4000`

### 6. Configure Frontend Environment

Create `frontend/.env` (copy from `.env.example`):

```bash
VITE_API_URL=http://localhost:4000
```

### 7. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 8. Start Frontend Development Server

```bash
npm run dev
```

App will run on `http://localhost:5173`

---

## 🔐 Authentication Flow Guide

### Signup

1. User fills signup form with email, password, full name
2. Frontend validates input (password min 8 chars)
3. Calls `POST /auth/signup`
4. Backend hashes password and creates user
5. Frontend auto-logs in user
6. Redirects to home page

**Frontend Code:**
```typescript
const { signup, login } = useAuth();
await signup(email, password, fullName);
```

### Login

1. User enters email and password
2. Calls `POST /auth/login`
3. Backend verifies credentials
4. Returns `accessToken` and `refreshToken`
5. Frontend stores tokens in localStorage
6. Fetches user info from `GET /auth/me`
7. Sets user in AuthContext
8. Redirects to home page

**Frontend Code:**
```typescript
const { login } = useAuth();
await login(email, password);
```

### Making Authenticated Requests

All API calls automatically include the JWT token:

```typescript
// In api.ts - automatically adds Authorization header
const token = localStorage.getItem("accessToken");
headers.Authorization = `Bearer ${token}`;
```

### Logout

1. User clicks logout button
2. Calls `POST /auth/logout`
3. Backend deletes session from database
4. Frontend clears localStorage tokens
5. Clears AuthContext user state
6. Redirects to login page

**Frontend Code:**
```typescript
const { logout } = useAuth();
await logout();
```

---

## 👥 User Roles & Permissions

### User Role
- ✅ View all doctors
- ✅ View available appointment slots
- ✅ Book appointments
- ✅ View booking status

### Admin Role
- ✅ All user permissions +
- ✅ Create new doctors
- ✅ Generate appointment slots
- ✅ Access admin panel

**Setting Admin Role (Database):**

```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

---

## 🛡️ Production Checklist

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Configure `FRONTEND_URL` to your production domain
- [ ] Enable HTTPS (TLS/SSL certificate)
- [ ] Use secure database credentials
- [ ] Set up database backups
- [ ] Implement password reset flow
- [ ] Set up email verification
- [ ] Enable CORS only for your domain
- [ ] Consider adding Redis for:
  - Session management
  - Rate limiting
  - Token blacklisting
  - Caching

### Environment Variables for Production

```bash
# backend/.env (production)
DATABASE_URL=postgres://user:secure_password@db-host:5432/medique
PORT=4000
NODE_ENV=production
JWT_SECRET=generate-with-crypto.randomBytes(32).toString('hex')
FRONTEND_URL=https://yourdomain.com
HTTPS=true

# Optional for advanced features
REDIS_URL=redis://redis-host:6379
SMTP_HOST=your-email-service
SMTP_PASSWORD=your-email-password
```

---

## 🔗 API Reference

### Auth Endpoints

#### POST /auth/signup
Create new user account

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepass123",
  "full_name": "John Doe"
}
```

**Response (201):**
```json
{
  "ok": true,
  "body": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user"
  }
}
```

#### POST /auth/login
Authenticate user and receive tokens

**Request:**
```json
{
  "email": "user@example.com",
  "password": "securepass123"
}
```

**Response (200):**
```json
{
  "ok": true,
  "body": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "abc123...",
    "expiresIn": "15m"
  }
}
```

#### GET /auth/me
Get current authenticated user

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Response (200):**
```json
{
  "ok": true,
  "body": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "user",
    "is_active": true
  }
}
```

#### POST /auth/logout
Logout user and revoke tokens

**Headers:**
```
Authorization: Bearer {accessToken}
```

**Request:**
```json
{
  "refreshToken": "abc123..."
}
```

**Response (200):**
```json
{
  "ok": true,
  "message": "Logged out successfully"
}
```

---

## 🧪 Testing Authentication

### Test Signup

```bash
curl -X POST http://localhost:4000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User"
  }'
```

### Test Login

```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Store the `accessToken` from response, then:

### Test Protected Route

```bash
curl -X GET http://localhost:4000/auth/me \
  -H "Authorization: Bearer {accessToken}"
```

### Test Admin Route

```bash
curl -X POST http://localhost:4000/admin/doctors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {accessToken}" \
  -d '{
    "name": "Dr. Smith",
    "specialization": "Cardiology",
    "experience_years": 10,
    "daily_start_time": "09:00:00",
    "daily_end_time": "17:00:00",
    "slot_duration_minutes": 30
  }'
```

---

## 📝 Frontend Component Integration

### AuthProvider

Wrap your app with `AuthProvider` in `main.tsx`:

```tsx
<AuthProvider>
  <DoctorsProvider>
    <BookingProvider>
      <App />
    </BookingProvider>
  </DoctorsProvider>
</AuthProvider>
```

### useAuth Hook

Access auth state and methods anywhere:

```tsx
const { user, isAuthenticated, login, logout } = useAuth();

if (!isAuthenticated) return <Navigate to="/login" />;
```

### Protected Routes

Use `ProtectedRoute` component:

```tsx
<Route
  path="/admin"
  element={<ProtectedRoute element={<Admin />} requiredRole="admin" />}
/>
```

---

## 🚨 Troubleshooting

### "Invalid credentials" on login
- Check email exists in database
- Verify password is correct
- Check user `is_active` flag is true

### "Unauthorized" on protected routes
- Ensure access token is in Authorization header
- Check token hasn't expired (15 min expiry)
- Verify JWT_SECRET matches between backend and token

### CORS errors
- Check `FRONTEND_URL` in backend `.env`
- Ensure frontend is making requests to correct API URL
- In development, should be `http://localhost:4000`

### "Admin role required"
- Only admin users can access `/admin/*` routes
- Update user role in database:
```sql
UPDATE users SET role = 'admin' WHERE id = 'user-id';
```

---

## 📚 Additional Resources

- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [bcrypt Documentation](https://github.com/kelektiv/node.bcrypt.js)
- [Express-Validator Documentation](https://express-validator.github.io/docs/)

---

## 📞 Support

For issues or questions about the authentication system, please check:
1. Environment variables are correctly set
2. Database migrations have run
3. Both backend and frontend servers are running
4. Network requests in browser DevTools
5. Server logs for detailed error messages

---

**Happy coding! 🎉**
