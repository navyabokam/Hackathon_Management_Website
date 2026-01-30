# Documentation Index

## 📚 Complete Documentation Map

Welcome! Here's a guide to all documentation files in this project.

### 🚀 Getting Started

**Start here if you're new:**

1. **[SUMMARY.md](SUMMARY.md)** ⭐
   - Project overview
   - What's included (features, files)
   - Quick facts about the codebase
   - Next steps after setup

2. **[QUICKSTART.md](QUICKSTART.md)** ⭐⭐
   - Step-by-step installation
   - Running the application
   - Testing complete flow
   - Troubleshooting common issues

### 📖 Reference Documentation

**For understanding the project:**

1. **[README.md](README.md)**
   - Complete feature list
   - Project structure
   - API endpoint documentation
   - Core workflows explained
   - Technology stack details
   - Development instructions

2. **[ARCHITECTURE.md](ARCHITECTURE.md)**
   - System architecture diagrams
   - Data models and schemas
   - Security implementation details
   - How to extend the system
   - Performance optimization
   - Deployment architecture

### 🚢 Deployment & Operations

**For deploying to production:**

1. **[DEPLOYMENT.md](DEPLOYMENT.md)**
   - Various deployment options
   - Environment setup
   - Database configuration
   - Email service setup
   - CI/CD configuration
   - Monitoring and logging
   - Backup strategies
   - Security checklist

### 🧪 Testing

**For writing and running tests:**

1. **[TESTING.md](TESTING.md)**
   - How to run tests
   - Test structure and examples
   - Test coverage goals
   - Testing best practices
   - Debugging tests
   - Performance testing
   - Testing checklist

### 🔧 Configuration Files

**Key configuration files:**

| File | Purpose |
|------|---------|
| `server/.env.sample` | Backend environment variables |
| `client/.env.sample` | Frontend environment variables |
| `docker-compose.yml` | Docker development environment |
| `server/tsconfig.json` | Backend TypeScript config |
| `client/tsconfig.json` | Frontend TypeScript config |
| `server/eslint.config.js` | Backend linting rules |
| `client/eslint.config.js` | Frontend linting rules |

## 📋 Quick Reference

### Common Commands

```bash
# Setup
npm install          # Install all dependencies
npm run seed         # Initialize database (backend)

# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Check code style
npm run format       # Format code

# Database
mongo               # Connect to MongoDB
npm run seed        # Reset & seed database
```

### Important URLs (Development)

| URL | Purpose |
|-----|---------|
| http://localhost:5173 | Frontend (React) |
| http://localhost:5173/register | Team registration |
| http://localhost:5173/admin/login | Admin login |
| http://localhost:4000/api/health | API health check |
| http://localhost:8025 | Email UI (MailHog) |
| http://localhost:8081 | Database UI (Mongo Express) |

### Admin Credentials (Default)

```
Email: admin@hackathon.local
Password: Admin@123
```

## 📂 Project Structure Overview

```
Hackathon_Management_Website/
├── Documentation/
│   ├── README.md              ← Start here for overview
│   ├── QUICKSTART.md          ← Installation guide
│   ├── SUMMARY.md             ← Project summary
│   ├── ARCHITECTURE.md        ← System design
│   ├── DEPLOYMENT.md          ← Production guide
│   ├── TESTING.md             ← Testing guide
│   └── INDEX.md               ← This file
│
├── Server/                     ← Node.js/Express backend
│   ├── src/
│   │   ├── models/            ← MongoDB schemas
│   │   ├── services/          ← Business logic
│   │   ├── routes/            ← API endpoints
│   │   ├── middleware/        ← Express middleware
│   │   └── schemas/           ← Validation
│   ├── package.json
│   └── .env.sample
│
├── Client/                     ← React frontend
│   ├── src/
│   │   ├── pages/             ← Route components
│   │   ├── services/          ← API client
│   │   ├── schemas/           ← Validation
│   │   └── types/             ← TypeScript types
│   ├── package.json
│   └── index.html
│
└── Docker/
    └── docker-compose.yml     ← Dev environment
```

## 🎯 Learning Paths

### Path 1: Quick Setup & Test (30 minutes)
1. Read [QUICKSTART.md](QUICKSTART.md)
2. Follow installation steps
3. Test the registration flow
4. Check admin dashboard

### Path 2: Understanding Architecture (1-2 hours)
1. Read [README.md](README.md) - Features section
2. Read [ARCHITECTURE.md](ARCHITECTURE.md) - Architecture section
3. Review core models: `server/src/models/`
4. Review main routes: `server/src/routes/`

### Path 3: Extending the System (2-4 hours)
1. Read [ARCHITECTURE.md](ARCHITECTURE.md) - Extending section
2. Study services: `server/src/services/`
3. Study API client: `client/src/services/api.ts`
4. Plan your changes

### Path 4: Deployment (1-2 hours)
1. Read [DEPLOYMENT.md](DEPLOYMENT.md)
2. Choose hosting provider
3. Setup MongoDB Atlas
4. Configure CI/CD
5. Deploy!

### Path 5: Testing & Quality (1-2 hours)
1. Read [TESTING.md](TESTING.md)
2. Run existing tests
3. Write new tests
4. Setup CI pipeline

## 🔍 Finding Things

### By Use Case

**I want to...**

| Goal | File | Section |
|------|------|---------|
| Add a payment gateway | [ARCHITECTURE.md](ARCHITECTURE.md) | Extending → Payment Gateway |
| Deploy to production | [DEPLOYMENT.md](DEPLOYMENT.md) | Production Deployment |
| Understand the database | [ARCHITECTURE.md](ARCHITECTURE.md) | Data Models |
| Add a new feature | [README.md](README.md) | API Endpoints |
| Write tests | [TESTING.md](TESTING.md) | Test Structure |
| Configure email | [DEPLOYMENT.md](DEPLOYMENT.md) | Email Service Setup |
| Scale the system | [ARCHITECTURE.md](ARCHITECTURE.md) | Scaling |

### By Technology

**Frontend (React/TypeScript)**
- Pages: `client/src/pages/`
- API Client: `client/src/services/api.ts`
- Validation: `client/src/schemas/`
- Types: `client/src/types/`
- Styles: `client/src/index.css`

**Backend (Node.js/Express)**
- Models: `server/src/models/`
- Routes: `server/src/routes/`
- Services: `server/src/services/`
- Validation: `server/src/schemas/`
- Middleware: `server/src/middleware/`

### By Feature

**User Registration**
- Frontend: [Register.tsx](client/src/pages/Register.tsx)
- Backend: [teams.ts](server/src/routes/teams.ts)
- Service: [team.service.ts](server/src/services/team.service.ts)
- Model: [Team.ts](server/src/models/Team.ts)

**Payments**
- Frontend: [Payment.tsx](client/src/pages/Payment.tsx)
- Backend: [payments.ts](server/src/routes/payments.ts)
- Model: [Payment.ts](server/src/models/Payment.ts)

**Admin Dashboard**
- Frontend: [AdminDashboard.tsx](client/src/pages/AdminDashboard.tsx)
- Backend: [admin-teams.ts](server/src/routes/admin-teams.ts)
- Auth: [admin.ts](server/src/routes/admin.ts)

## ❓ FAQ

**Q: Where do I start?**
A: Read [QUICKSTART.md](QUICKSTART.md) for installation, then [SUMMARY.md](SUMMARY.md) for overview.

**Q: How do I add a new API endpoint?**
A: Create a route in `server/src/routes/`, create a service in `server/src/services/`, add validation in `server/src/schemas/`.

**Q: How do I integrate a real payment gateway?**
A: Follow the guide in [ARCHITECTURE.md](ARCHITECTURE.md) under "Extending → Adding Real Payment Gateway".

**Q: How do I deploy to production?**
A: Read [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions for various platforms.

**Q: Where are the tests?**
A: Test files are alongside source files with `.test.ts` extension. See [TESTING.md](TESTING.md) for details.

**Q: How do I change the email template?**
A: Edit [email.ts](server/src/utils/email.ts) in the sendConfirmationEmail function.

**Q: Can I run this with Docker?**
A: Yes! Use `docker-compose up` to start MongoDB, MailHog, and Mongo Express. See [DEPLOYMENT.md](DEPLOYMENT.md) for details.

## 🤝 Contributing

To contribute improvements:

1. Make your changes
2. Run tests: `npm run test`
3. Format code: `npm run format`
4. Check linting: `npm run lint`
5. Update documentation if needed

## 📊 Project Stats

- **Total Files**: 50+
- **Lines of Code**: 5000+
- **TypeScript**: 100%
- **Documentation**: 4 guides
- **Test Files**: 5
- **Pages/Components**: 12+
- **API Endpoints**: 10+
- **Database Models**: 3

## 🎓 Learning Resources

### Built-in Learning
- All code is well-commented
- TypeScript provides type hints
- Error messages are descriptive
- Test files show usage examples

### External Resources
- [Express.js Guide](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🚀 Next Steps

1. **Follow QUICKSTART.md** to get running (5 mins)
2. **Test the application** with sample data (10 mins)
3. **Read README.md** to understand features (10 mins)
4. **Read ARCHITECTURE.md** to understand design (20 mins)
5. **Customize for your hackathon** (ongoing)
6. **Follow DEPLOYMENT.md** to go live (varies)

## 📞 Support

If you get stuck:

1. Check the [Troubleshooting](QUICKSTART.md#troubleshooting-guide) section
2. Review [ARCHITECTURE.md](ARCHITECTURE.md) for design questions
3. Check error messages in console/logs
4. Review test files for usage examples

## 📝 Document Versions

| Document | Last Updated | Version |
|----------|--------------|---------|
| README.md | Jan 30, 2024 | 1.0 |
| QUICKSTART.md | Jan 30, 2024 | 1.0 |
| ARCHITECTURE.md | Jan 30, 2024 | 1.0 |
| DEPLOYMENT.md | Jan 30, 2024 | 1.0 |
| TESTING.md | Jan 30, 2024 | 1.0 |
| SUMMARY.md | Jan 30, 2024 | 1.0 |

---

**Start with [QUICKSTART.md](QUICKSTART.md) and enjoy building! 🎉**
