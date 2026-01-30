# Quick Start Guide

Follow these steps to get the hackathon registration system running locally.

## Prerequisites

1. **Node.js 20+**: Download from https://nodejs.org/
2. **MongoDB**: Install from https://www.mongodb.com/try/download/community
   - Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

## Step-by-Step Setup

### 1. Navigate to Project Directory

```bash
cd d:\3_2\Hackathon_Management_Website
```

### 2. Install Dependencies

```bash
# Install all dependencies for both server and client
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies  
cd client
npm install
cd ..
```

### 3. Setup Backend Environment

```bash
cd server
cp .env.sample .env
```

Edit `server/.env` if needed (defaults work for local development):
- `MONGODB_URI=mongodb://localhost:27017/hackathon` (MongoDB running locally)
- `JWT_SECRET=change_me_in_production_to_a_secure_random_string`
- `PAYMENT_AMOUNT=500`

### 4. Initialize Database with Seed Data

```bash
cd server
npm run seed
```

Expected output:
```
✓ Connected to MongoDB
✓ Admin user created: admin@hackathon.local
✓ Seed completed
```

### 5. Start MongoDB (if not running)

**Windows (PowerShell)**:
```powershell
mongod
```

Or if installed as a service:
```powershell
net start MongoDB
```

**macOS**:
```bash
brew services start mongodb-community
```

**Linux**:
```bash
sudo systemctl start mongod
```

### 6. Start the Backend Server

In one terminal:
```bash
cd server
npm run dev
```

Expected output:
```
✓ Connected to MongoDB
✓ Server running on http://localhost:4000
✓ Environment: development
```

### 7. Start the Frontend Development Server

In another terminal:
```bash
cd client
npm run dev
```

Expected output:
```
VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### 8. Open in Browser

1. **Landing Page**: http://localhost:5173
2. **Register Team**: http://localhost:5173/register
3. **Admin Login**: http://localhost:5173/admin/login

## Testing the Complete Flow

### Public Registration Flow:

1. **Go to**: http://localhost:5173/register
2. **Fill form**:
   - Team Name: TestTeam1
   - College: Test University
   - Leader Email: leader@test.com
   - Leader Phone: 9876543210
   - Add 2 participants with unique emails/phones
3. **Submit** → Redirected to payment page
4. **Click "Simulate Payment Success"** → Redirected to confirmation
5. **Copy Registration ID** (e.g., HACK-2024-ABC123)

### Public Lookup:

1. **Go to**: http://localhost:5173/lookup
2. **Enter Registration ID** from previous step
3. **View Status**: Should show "CONFIRMED" + "Not Verified"

### Admin Dashboard:

1. **Go to**: http://localhost:5173/admin/login
2. **Login with**:
   - Email: `admin@hackathon.local`
   - Password: `Admin@123`
3. **View Dashboard**: Lists all registered teams
4. **Search**: Try searching by team name, college, or registration ID
5. **Click "View"**: See team details
6. **Mark Verified**: Toggle verification status
7. **Check Lookup**: Go back to /lookup to see updated status

## Build for Production

### Backend:
```bash
cd server
npm run build
npm start
```

### Frontend:
```bash
cd client
npm run build
npm run preview
```

## Common Issues & Solutions

### Issue: "Cannot find module 'mongoose'"

**Solution**:
```bash
cd server
npm install mongoose
```

### Issue: MongoDB Connection Error

**Solution**:
```bash
# Check if MongoDB is running
# If using local MongoDB, start it:
mongod

# Or update MONGODB_URI in server/.env
MONGODB_URI=mongodb://localhost:27017/hackathon
```

### Issue: Port 4000 or 5173 Already in Use

**Solution - Change ports in .env**:
```bash
# server/.env
PORT=4001

# client/vite.config.ts (change port property)
server: {
  port: 5174,
  ...
}
```

### Issue: Admin Login Fails

**Solution**: Re-run seed script
```bash
cd server
npm run seed
```

### Issue: CORS Error in Browser Console

**Solution**: Ensure `CLIENT_ORIGIN` in `server/.env` matches your client URL:
```bash
# server/.env
CLIENT_ORIGIN=http://localhost:5173
```

## Project Structure

```
Hackathon_Management_Website/
├── server/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/        # Configuration
│   │   ├── models/        # MongoDB schemas
│   │   ├── services/      # Business logic
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth, error handling
│   │   ├── schemas/       # Validation
│   │   ├── utils/         # Helper functions
│   │   └── index.ts       # App entry
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.sample
│
├── client/                # React frontend
│   ├── src/
│   │   ├── pages/        # Route components
│   │   ├── services/     # API client
│   │   ├── types/        # TypeScript types
│   │   ├── schemas/      # Validation
│   │   ├── App.tsx       # Router
│   │   └── main.tsx      # Entry point
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## Key Features to Test

- ✅ Team registration with validation
- ✅ Mock payment (success/failure)
- ✅ Confirmation with registration ID
- ✅ Public lookup by registration ID
- ✅ Admin login and authentication
- ✅ Team list view with search
- ✅ Team verification toggle
- ✅ Responsive UI on mobile/desktop

## Development Tips

### Code Formatting

```bash
# Server
cd server
npm run format

# Client
cd client
npm run format
```

### Linting

```bash
# Check for errors
cd server
npm run lint

cd client
npm run lint
```

### View MongoDB Data

Use MongoDB Compass or mongosh CLI:

```bash
mongosh
# Then in mongosh:
use hackathon
db.teams.find()
db.payments.find()
db.adminusers.find()
```

## Next Steps

Once running:

1. Explore the UI and test workflows
2. Check network requests in browser DevTools
3. Review MongoDB data in MongoDB Compass
4. Read code comments for implementation details
5. Customize for your hackathon (prizes, timeline, rules, etc.)

## Support Files

- **README.md** - Complete documentation
- **server/.env.sample** - Backend config template
- **client/.env.sample** - Frontend config template

## API Documentation

See **README.md** for full list of endpoints and their usage.

---

**Happy Coding! 🚀**
