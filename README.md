# College Hackathon Registration & Management Website

✅ **FULLY FUNCTIONAL AND READY TO USE**

A complete MERN (MongoDB, Express, React, Node.js) application for managing hackathon team registrations, payments, and verifications.

## 🚀 Quick Start (60 seconds)

```bash
# Install all dependencies
npm run install-all

# Start both servers
npm run dev

# Open browser
# Frontend: http://localhost:5173
# Backend: http://localhost:4000/api
```

**For Windows users:** If you encounter terminal issues, run servers separately:
```bash
# Terminal 1
npm run dev:server

# Terminal 2
npm run dev:client
```

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed setup instructions.
See [PROJECT_STATUS.md](PROJECT_STATUS.md) for current system status.

## 🎯 Features

- **Team Registration**: Register teams with up to 4 members with validation
- **Mock Payment System**: Simulate successful/failed payments with transaction refs
- **Admin Dashboard**: Verify teams, search registrations, view detailed team information
- **Public Lookup**: Check registration status with unique Registration ID
- **Email Notifications**: Confirmation emails on successful payment
- **Security**: JWT authentication, password hashing, rate limiting
- **Responsive UI**: Clean, modern interface with Tailwind CSS
- **End-to-End TypeScript**: Type-safe codebase

## 📋 Prerequisites

- Node.js 20+
- MongoDB 4.0+
- npm or yarn

## 🚀 Quick Start

### 1. Clone & Setup

```bash
cd Hackathon_Management_Website
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 2. Configure Environment

**Server** (create `server/.env`):
```bash
cp server/.env.sample server/.env
```

Default values work for local development. Update if needed:
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `SMTP_HOST`, `SMTP_PORT`: Email configuration (console logs in dev mode)

### 3. Initialize Database

```bash
cd server
npm run seed
```

This creates the admin user:
- Email: `admin@hackathon.local`
- Password: `Admin@123`

### 4. Start Services

**Terminal 1 - Backend**:
```bash
cd server
npm run dev
# Server runs on http://localhost:4000
```

**Terminal 2 - Frontend**:
```bash
cd client
npm run dev
# Client runs on http://localhost:5173
```

### 5. Access the Application

- **Public Site**: http://localhost:5173
- **Admin Login**: http://localhost:5173/admin/login
- **API Health**: http://localhost:4000/api/health

## 📊 Project Structure

```
├── server/
│   ├── src/
│   │   ├── config/          # Environment config
│   │   ├── models/          # Mongoose schemas (Team, Payment, AdminUser)
│   │   ├── services/        # Business logic
│   │   ├── routes/          # Express routes
│   │   ├── middleware/      # Auth, error handling
│   │   ├── schemas/         # Zod validation schemas
│   │   ├── utils/           # Helpers (email, ID generation)
│   │   ├── scripts/         # Seed script
│   │   └── index.ts         # Express app entry
│   ├── .env.sample
│   ├── package.json
│   └── tsconfig.json
│
├── client/
│   ├── src/
│   │   ├── pages/           # React pages (Landing, Register, Admin, etc.)
│   │   ├── services/        # API client (axios)
│   │   ├── schemas/         # Zod validation schemas
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # Helpers
│   │   ├── App.tsx          # Router setup
│   │   ├── main.tsx         # Entry point
│   │   └── index.css        # Tailwind styles
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md (this file)
```

## 🔌 API Endpoints

### Public Endpoints

**Teams**:
- `POST /api/teams` - Create team registration
- `GET /api/teams/:registrationId` - Get public team view

**Payments**:
- `POST /api/payments/initiate` - Start payment process
- `POST /api/payments/confirm` - Confirm successful payment
- `POST /api/payments/fail` - Mark payment as failed

**Other**:
- `GET /api/health` - Health check

### Admin Endpoints (Require JWT)

**Auth**:
- `POST /api/admin/auth/login` - Admin login
- `POST /api/admin/auth/logout` - Admin logout

**Teams**:
- `GET /api/admin/teams` - List all teams
- `GET /api/admin/teams/:id` - Get team details
- `PATCH /api/admin/teams/:id/verify` - Toggle verification status
- `GET /api/admin/search/:type/:query` - Search teams (registrationId, teamName, collegeName)

## 📝 Core Workflows

### Registration Flow

1. User fills registration form → validates on client
2. `POST /api/teams` creates team with `PENDING_PAYMENT` status
3. `POST /api/payments/initiate` creates payment record
4. User taken to payment page (mock gateway)
5. On success: `POST /api/payments/confirm` updates status to `CONFIRMED`
6. Confirmation page displays Registration ID + email sent
7. Public lookup allows status check with Registration ID

### Admin Verification Flow

1. Admin logs in with email/password
2. Dashboard lists all teams with statuses
3. Click team → view details, participants, payment status
4. "Mark Verified" button toggles verification (PATCH endpoint)
5. Verification visible in public lookup

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Auth**: HS256 signed tokens, httpOnly cookies
- **Input Validation**: Zod schemas on client & server
- **Rate Limiting**: 100 req/15min general, 5 req/15min for critical endpoints
- **CORS**: Configured to client origin only
- **Security Headers**: Helmet middleware
- **SQL/NoSQL Prevention**: Mongoose parameterized queries
- **Unique Constraints**: Email/phone/team name validation at DB level

## 🧪 Testing (Scaffolded)

Run tests:
```bash
# Backend
cd server
npm run test

# Frontend
cd client
npm run test
```

Test files can be added following convention: `*.test.ts` / `*.test.tsx`

## 🛠️ Development

### Build for Production

```bash
# Backend
cd server
npm run build
npm start

# Frontend
cd client
npm run build
npm run preview
```

### Linting & Formatting

```bash
# Server
cd server
npm run lint
npm run format

# Client
cd client
npm run lint
npm run format
```

## 📧 Email Notifications

In development, emails are logged to console. To enable real SMTP:

Update `server/.env`:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

## 💾 Database Schema

### Team
- `registrationId`: Unique (HACK-YYYY-XXXXXX)
- `teamName`: Unique, required
- `collegeName`: Required
- `participants`: Array of 1-4 members
- `leaderEmail`: Unique, required
- `leaderPhone`: Unique, required
- `status`: PENDING_PAYMENT | CONFIRMED | CANCELLED
- `verificationStatus`: Not Verified | Verified
- `timestamps`: createdAt, updatedAt

### Payment
- `teamId`: Unique, required
- `amount`: Default 500 INR
- `status`: Pending | Success | Failed
- `transactionRef`: Unique reference
- `timestamps`: createdAt, updatedAt

### AdminUser
- `email`: Unique, required
- `passwordHash`: bcrypt hashed
- `role`: admin
- `timestamps`: createdAt, updatedAt

## 🎨 UI Components

- **Landing Page**: Hero, timeline, prizes, FAQ
- **Registration Form**: Multi-step validation, dynamic participant fields
- **Payment Page**: Mock gateway with success/fail buttons
- **Confirmation Page**: Registration ID display, email confirmation message
- **Admin Dashboard**: Team list, search, status badges
- **Admin Team Detail**: Full team info, verification toggle

## 🔄 State Management

- Frontend: React Hook Form + React Query
- Backend: In-memory request handling (stateless)
- Session: JWT + localStorage on client, httpOnly cookie on server

## 📱 Responsive Design

- Mobile-first approach with Tailwind CSS
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly buttons and forms

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Check MONGODB_URI in .env
Ensure MongoDB is running locally or update connection string
```

### "Admin user not found" during login
```
Run: npm run seed
This creates default admin@hackathon.local / Admin@123
```

### CORS Error
```
Ensure CLIENT_ORIGIN in server/.env matches client URL (default: http://localhost:5173)
```

### Payment endpoints return 401
```
Make sure token is stored in localStorage and passed in requests
```

## 📚 Technologies

**Backend**:
- Express.js - HTTP server
- Mongoose - MongoDB ODM
- Zod - Schema validation
- JWT - Authentication
- bcryptjs - Password hashing
- Nodemailer - Email
- Morgan - Request logging
- Helmet - Security headers
- Express Rate Limit - Throttling

**Frontend**:
- React 18 - UI library
- React Router - Client routing
- React Hook Form - Form state
- React Query - API data fetching
- Zod - Client-side validation
- Axios - HTTP client
- Tailwind CSS - Styling
- Vite - Build tool

**Tooling**:
- TypeScript - Type safety
- ESLint - Linting
- Prettier - Code formatting
- Vitest/Jest - Testing

## 📄 License

MIT

## 👥 Support

For issues or questions, refer to the documentation or modify the code to extend functionality.

---

**Happy Hacking! 🚀**
