# Hackathon Management Website - Setup & Running Guide

## Project Status

✅ **Working:**
- MongoDB Atlas cloud connection
- Backend API server (Express on port 4000)
- Frontend dev server (Vite on port 5173)
- TypeScript compilation
- CORS configuration
- Health check endpoint
- Team registration validation

## Prerequisites

- Node.js 18+ and npm
- MongoDB Atlas account with cluster created
- Internet connection

## Environment Configuration

### MongoDB Atlas Setup
1. Create a MongoDB Atlas cluster
2. Add your IP to Network Access whitelist
3. Get connection string and update `server/.env`

### Configuration Files

**server/.env** (already configured):
```
PORT=4000
MONGODB_URI=mongodb+srv://myAtlasDBUser:...@myatlasclusteredu.bw6sol8.mongodb.net/hackathon?retryWrites=true&w=majority
JWT_SECRET=change_me_in_production_to_a_secure_random_string
CLIENT_ORIGIN=http://localhost:5173,http://localhost:5174
TEAM_MAX_SIZE=4
PAYMENT_AMOUNT=500
```

**client/.env** (already configured):
```
VITE_API_URL=http://localhost:4000/api
```

## Installation

```bash
# Install all dependencies
npm run install-all

# Or manually:
npm install
cd server && npm install && cd ../client && npm install && cd ..
```

## Running the Application

### Option 1: Run Both Servers Together (Recommended)
```bash
npm run dev
```

This uses `concurrently` to run both servers in watch mode.

**Important for Windows PowerShell:** If you interrupt this command or run something in the same terminal, both servers will terminate. This is normal PowerShell behavior with concurrently. Either:
- Use a separate terminal for testing API endpoints
- Or use Option 2 below

### Option 2: Run Servers Separately (Best for Windows)

**Terminal 1 - Backend:**
```bash
npm run dev:server
```

**Terminal 2 - Frontend:**
```bash
npm run dev:client
```

## Testing the Application

### 1. Access the Frontend
- Navigate to: http://localhost:5173
- You should see the landing page with "College Hackathon 2024"

### 2. Test Team Registration
- Click "Get Started" or navigate to http://localhost:5173/register
- Fill in the form:
  - Team Name: (any name)
  - College Name: (any college)
  - Leader Email: (valid email format)
  - Leader Phone: (10-15 digits)
  - Team Members: At least 1, up to 4 members with full details
- Submit the form

### 3. Test Health Endpoint
```bash
# In PowerShell
Invoke-WebRequest -Uri "http://localhost:4000/api/health" -UseBasicParsing | Select-Object -Property StatusCode, Content
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2026-01-30T...",
  "uptime": 123.456,
  "version": "1.0.0"
}
```

## Troubleshooting

### Servers Won't Start
1. Check if ports 4000/5173 are already in use
2. Verify MongoDB connection string in `server/.env`
3. Check MongoDB Atlas network whitelist includes your IP
4. Run `npm install` in both directories

### CORS Errors
- Ensure `CLIENT_ORIGIN` in `server/.env` includes current frontend port
- Currently configured for: http://localhost:5173,http://localhost:5174

### MongoDB Connection Fails
- Check MongoDB URI in `server/.env` (must have correct password)
- Verify database "hackathon" exists in Atlas
- Ensure IP whitelist includes your connection IP

### Port Already in Use
```bash
# Find process using port 4000
netstat -ano | findstr :4000

# Kill the process (Windows)
taskkill /PID <PID> /F

# Or change port in server/.env
PORT=4001
```

## API Endpoints

### Public Endpoints
- `GET /api/health` - Health check
- `POST /api/teams` - Register a team
- `GET /api/teams/:registrationId` - Get team details
- `POST /api/payments/confirm` - Confirm payment

### Admin Endpoints
- `POST /api/admin/auth/login` - Admin login
- `GET /api/admin/teams` - List all teams
- `PUT /api/admin/teams/:registrationId/verify` - Verify team

## Database Models

### Team
- registrationId (unique)
- teamName (unique)
- collegeName
- teamSize
- participants[] (up to 4)
- leaderEmail (unique)
- leaderPhone (unique)
- status: PENDING_PAYMENT | CONFIRMED | CANCELLED
- payment (reference to Payment)

### Payment
- teamId (reference to Team)
- amount: 500 (configurable)
- currency: INR
- status: Pending | Success | Failed
- transactionRef (unique)

## Build & Deployment

```bash
# Build both projects
npm run build

# Build only server/client
npm run build:server
npm run build:client

# Production start (after build)
cd server && node dist/index.js
cd client && npm run preview
```

## Key Features Implemented

✅ Team registration with duplicate checking
✅ Payment processing flow
✅ Admin dashboard and verification
✅ JWT authentication
✅ Email notifications (configured with Nodemailer)
✅ Input validation with Zod
✅ Rate limiting
✅ CORS support
✅ MongoDB Atlas integration
✅ Hot reloading in development

## Notes

- The application is in development mode
- MongoDB Atlasuses a cloud connection string
- Admin credentials can be set in `server/.env`
- Email sending requires SMTP configuration in `server/.env`
- Seed script available: `npm run seed`
