# FitZone Gym Management System

A full-stack gym management application with React frontend and Node.js/Express backend.

## Features

### Admin Panel
- Dashboard with revenue analytics and charts
- Member management (CRUD, status, plans)
- Trainer management (profiles, schedules, ratings)
- Class scheduling (categories, difficulty levels)
- Membership plan management
- Payment tracking and invoicing

### Member Portal
- Class booking system
- Profile management
- Booking history
- Membership status

### Public Pages
- Landing page with hero section
- Class listings with filters
- Trainer profiles
- Contact form

## Tech Stack
- **Frontend:** React 18, Tailwind CSS, Vite, Recharts
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Auth:** JWT (JSON Web Tokens)
- **Deployment:** Vercel (Frontend) + Railway (Backend)

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure your MongoDB URI and JWT secret
npm run seed           # Seed the database with sample data
npm run dev            # Start development server on port 5000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev            # Start development server on port 3000
```

### Test Accounts (after seeding)
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@fitzone.com | admin123 |
| Member | john@example.com | member123 |
| Trainer | sarah@fitzone.com | trainer123 |

## API Endpoints

| Route | Description | Auth |
|-------|-------------|------|
| POST /api/auth/register | Register new user | No |
| POST /api/auth/login | Login | No |
| GET /api/auth/me | Get current user | Yes |
| GET /api/dashboard | Admin dashboard stats | Admin |
| GET /api/members | List members | Admin |
| GET /api/trainers | List trainers | Public |
| GET /api/classes | List classes | Public |
| GET /api/classes/schedule | Weekly schedule | Public |
| POST /api/bookings | Book a class | Member |
| GET /api/payments | List payments | Admin |
| GET /api/plans | List active plans | Public |

## Deployment

### Frontend (Vercel)
1. Push to GitHub
2. Import project on Vercel
3. Set root directory to `frontend`
4. Build command: `npm run build`
5. Output directory: `dist`

### Backend (Railway)
1. Push to GitHub
2. Create new project on Railway
3. Add environment variables:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - Random secure string
   - `NODE_ENV=production`

## License
MIT
