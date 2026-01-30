# Architecture & Implementation Guide

## Project Overview

This is a full-stack MERN application for managing college hackathon registrations with team management, payments, and admin verification.

### Key Design Decisions

1. **Monorepo Structure**: `/server` and `/client` folders for clear separation
2. **End-to-End TypeScript**: Type safety across frontend and backend
3. **Zod Schemas**: Single source of truth for validation rules (client & server)
4. **Mock Payment Flow**: Pluggable architecture for real payment gateways
5. **JWT + httpOnly Cookies**: Secure admin authentication
6. **MongoDB with Mongoose**: Flexible schema with indexes for performance

## Architecture

### Backend Architecture

```
Express Server
├── Routes (Express routers)
│   ├── /api/teams (register teams)
│   ├── /api/payments (mock payment flow)
│   ├── /api/admin/auth (login/logout)
│   ├── /api/admin/teams (verification, search)
│   └── /api/health (status check)
│
├── Middleware
│   ├── Authentication (JWT validation)
│   ├── Error Handling (global error handler)
│   ├── CORS (client origin validation)
│   ├── Rate Limiting (prevent abuse)
│   └── Security (helmet headers)
│
├── Services (Business Logic)
│   ├── Team Service (register, search, verify)
│   ├── Auth Service (login, token generation)
│   └── Email Service (confirmation emails)
│
├── Models (Mongoose Schemas)
│   ├── Team (registration data)
│   ├── Payment (transaction records)
│   └── AdminUser (authentication)
│
└── Database (MongoDB)
    ├── Teams Collection
    ├── Payments Collection
    └── AdminUsers Collection
```

### Frontend Architecture

```
React App
├── Pages (Route Components)
│   ├── Landing (public homepage)
│   ├── Register (team registration form)
│   ├── Payment (mock payment UI)
│   ├── Confirmation (success page)
│   ├── Lookup (public status check)
│   ├── AdminLogin (auth)
│   ├── AdminDashboard (team list)
│   └── AdminTeamDetail (team info + verify)
│
├── Services
│   └── API Client (axios wrapper with endpoints)
│
├── Hooks & State
│   ├── React Hook Form (form state)
│   ├── React Query (API data fetching)
│   └── localStorage (JWT token storage)
│
├── Schemas
│   └── Zod Validators (client-side validation)
│
└── Styles
    └── Tailwind CSS (responsive utility-first)
```

## Core Workflows

### 1. Team Registration Flow

```
User Form Input
    ↓
Client Validation (Zod)
    ↓
POST /api/teams
    ↓
Server Validation (Zod)
    ↓
Check Duplicates (email, phone, team name)
    ↓
Create Team (status = PENDING_PAYMENT)
    ↓
Create Payment Record (status = Pending)
    ↓
Return registrationId
    ↓
Redirect to /payment?registrationId=...
```

### 2. Payment Flow

```
Payment Page (Mock Gateway)
    ↓
User clicks "Success" or "Failed"
    ↓
POST /api/payments/confirm or /api/payments/fail
    ↓
Update Payment Record (status = Success/Failed)
    ↓
Update Team (status = CONFIRMED or stay PENDING)
    ↓
If Success:
  → Send Confirmation Email
  → Redirect to /confirmation
  → Show Registration ID
```

### 3. Admin Verification Flow

```
Admin Login
    ↓
POST /api/admin/auth/login
    ↓
JWT Generated + httpOnly Cookie Set
    ↓
Store Token in localStorage
    ↓
GET /api/admin/teams (with auth middleware)
    ↓
Display Teams List
    ↓
Click Team → GET /api/admin/teams/:id
    ↓
Show Team Details
    ↓
PATCH /api/admin/teams/:id/verify
    ↓
Toggle verificationStatus
    ↓
Update in Database
```

## Data Models

### Team Document

```javascript
{
  _id: ObjectId,
  registrationId: "HACK-2024-ABC123",      // Unique
  teamName: "CodeMasters",                  // Unique
  collegeName: "XYZ University",
  teamSize: 2,
  participants: [
    {
      fullName: "John Doe",
      email: "john@example.com",           // Unique globally
      phone: "9876543210",                 // Unique globally
      rollNumber: "CSE-001"
    }
  ],
  leaderEmail: "leader@example.com",       // Unique
  leaderPhone: "1234567890",               // Unique
  payment: ObjectId(payment._id),
  status: "CONFIRMED",                     // PENDING_PAYMENT | CONFIRMED | CANCELLED
  verificationStatus: "Verified",          // Not Verified | Verified
  createdAt: 2024-01-30T12:34:56Z,
  updatedAt: 2024-01-30T12:34:56Z
}
```

### Payment Document

```javascript
{
  _id: ObjectId,
  teamId: ObjectId(team._id),              // Unique
  amount: 500,
  currency: "INR",
  status: "Success",                       // Pending | Success | Failed
  transactionRef: "TXN-17068234567-ABC123",// Unique
  provider: "mock",
  createdAt: 2024-01-30T12:34:56Z,
  updatedAt: 2024-01-30T12:34:56Z
}
```

### AdminUser Document

```javascript
{
  _id: ObjectId,
  email: "admin@hackathon.local",          // Unique
  passwordHash: "$2a$10$...",              // bcrypt hashed
  role: "admin",
  createdAt: 2024-01-30T12:34:56Z,
  updatedAt: 2024-01-30T12:34:56Z
}
```

## Security Considerations

### Authentication
- **JWT**: Signed with secret key, expires in 24 hours
- **httpOnly Cookies**: Prevents XSS attacks
- **Password Hashing**: bcrypt with 10 salt rounds

### Input Validation
- **Client**: Zod schemas on all forms
- **Server**: Duplicate Zod validation + custom checks
- **Database**: Unique indexes prevent duplicates

### API Security
- **CORS**: Restricted to client origin only
- **Rate Limiting**: 
  - 100 req/15min general
  - 5 req/15min for registration/payments
- **Helmet**: Security headers (CSP, X-Frame-Options, etc.)
- **HTTPS**: Use in production (current setup is HTTP for dev)

### Data Protection
- **No Credit Card Storage**: Only transaction refs stored
- **Email Masking**: Consider in production
- **Phone Validation**: Format check only, no storage restrictions
- **GDPR**: Add data deletion feature for production

## Extending the System

### Adding a Real Payment Gateway

1. **Create Payment Provider Interface**:
```typescript
interface PaymentProvider {
  initiatePayment(amount: number, teamId: string): Promise<Session>;
  confirmPayment(sessionId: string): Promise<Transaction>;
}
```

2. **Implement Razorpay/Stripe**:
```typescript
class RazorpayProvider implements PaymentProvider {
  async initiatePayment(amount, teamId) {
    // Call Razorpay API
    // Return session with payment URL
  }
}
```

3. **Update Payment Service**:
```typescript
export async function initiatePayment(registrationId: string) {
  const provider = new RazorpayProvider();
  return provider.initiatePayment(config.paymentAmount, team._id);
}
```

### Adding Email Queue (Bull/BullMQ)

```typescript
const emailQueue = new Queue('email');
emailQueue.add('confirmation', { email, registrationId });

emailQueue.process('confirmation', async (job) => {
  await sendConfirmationEmail(job.data.email, job.data.registrationId);
});
```

### Adding WebSocket for Real-time Updates

```typescript
import socketIo from 'socket.io';

const io = socketIo(server, { cors: { origin: config.clientOrigin } });
io.on('connection', (socket) => {
  socket.on('verify-team', (teamId) => {
    io.emit('team-verified', { teamId });
  });
});
```

### Adding File Uploads (Project Submissions)

```typescript
import multer from 'multer';
import { S3Client } from '@aws-sdk/client-s3';

const upload = multer({ dest: 'uploads/' });
app.post('/api/teams/:id/upload', upload.single('project'), async (req) => {
  // Upload to S3
  // Store URL in Team document
});
```

## Performance Optimization

### Database Indexing
- Indexes on all searchable fields (done in models)
- Compound indexes for common queries
- Example: `db.teams.createIndex({ "createdAt": -1 })`

### Caching Strategy
- Cache admin teams list (5 min TTL)
- Cache team detail views (1 min TTL)
- Use Redis in production

```typescript
const cacheKey = `team:${registrationId}`;
let team = await redis.get(cacheKey);
if (!team) {
  team = await Team.findOne({ registrationId });
  await redis.set(cacheKey, JSON.stringify(team), 'EX', 60);
}
```

### Frontend Optimization
- Code splitting by route
- Image lazy loading
- API debouncing on search (500ms delay)
- Optimistic UI updates

## Testing Strategy

### Unit Tests
- Validators (Zod schemas)
- ID generators
- Utility functions

### Integration Tests
- Team creation with duplicates
- Payment confirm/fail
- Auth login/logout
- Admin verification

### E2E Tests (Playwright)
- Full registration flow
- Admin dashboard navigation
- Payment simulation

## Deployment

### Backend (Node.js)
- **Environment**: Node 20+ LTS
- **Host**: Heroku, Railway, AWS EC2, DigitalOcean
- **Database**: MongoDB Atlas (cloud) or self-hosted
- **Caching**: Redis (optional, for production)

### Frontend (React)
- **Build**: `npm run build` → generates /dist
- **Host**: Vercel, Netlify, AWS S3 + CloudFront
- **CI/CD**: GitHub Actions, GitLab CI

### Docker Deployment

```dockerfile
# server/Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]

# client/Dockerfile
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Variables (Production)

**Server**:
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hackathon
JWT_SECRET=<long-random-secret>
CLIENT_ORIGIN=https://hackathon.example.com
SMTP_HOST=smtp.gmail.com
SMTP_USER=noreply@example.com
SMTP_PASS=<app-password>
NODE_ENV=production
```

**Frontend**:
```
VITE_API_URL=https://api.hackathon.example.com
```

## Monitoring & Logging

### Backend Logging
```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Error Tracking
- **Sentry**: Real-time error tracking
- **DataDog**: APM and logs aggregation
- **LogRocket**: Frontend session replay

## Troubleshooting Guide

### Common Issues

1. **Duplicate Key Error**
   - Clear MongoDB collections and re-seed
   - Check unique indexes

2. **CORS Errors**
   - Verify CLIENT_ORIGIN env var
   - Check browser console for exact error

3. **JWT Expired**
   - Clear localStorage and re-login
   - Increase expiry in production

4. **Email Not Sending**
   - Check SMTP credentials
   - Enable "Less Secure App Access" for Gmail
   - Use Gmail App Passwords with 2FA

## Resources

- **MongoDB Docs**: https://docs.mongodb.com/
- **Express**: https://expressjs.com/
- **React**: https://react.dev/
- **Mongoose**: https://mongoosejs.com/
- **Zod**: https://zod.dev/
- **Tailwind**: https://tailwindcss.com/
- **TypeScript**: https://www.typescriptlang.org/

---

For questions or improvements, check the main README.md or QUICKSTART.md files.
