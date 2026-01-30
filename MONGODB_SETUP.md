# MongoDB Setup Options

## Option 1: MongoDB Atlas (Cloud - Recommended for Quick Start)

1. Go to [mongodb.com/cloud](https://www.mongodb.com/cloud/atlas)
2. Sign up for free account
3. Create a cluster (free tier available)
4. Get connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/hackathon`)
5. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hackathon
   ```
6. Run seed script:
   ```bash
   npm run seed
   ```

## Option 2: MongoDB Community (Local Installation)

### Windows Installation:
1. Download from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Run installer (.msi)
3. Choose "Install MongoDB as a Service"
4. MongoDB will start automatically on `localhost:27017`
5. Run seed script:
   ```bash
   npm run seed
   ```

### Verify Installation:
```powershell
# Check if MongoDB is running
Test-NetConnection -ComputerName localhost -Port 27017
```

## Option 3: Docker (if you have Docker Desktop)

1. Install [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
2. Run in project root:
   ```bash
   docker-compose up -d
   ```
3. Wait 10-15 seconds for MongoDB to start
4. Run seed script:
   ```bash
   npm run seed
   ```

## Running the Seed Script

Once MongoDB is running:

```bash
# Using the npm script
npm run seed

# Or with PowerShell bypass
powershell -NoProfile -ExecutionPolicy Bypass -Command "cd 'd:\3_2\Hackathon_Management_Website' ; npm run seed"
```

### Expected Output:
```
✓ Admin user created: admin@hackathon.local
Database initialized successfully!
```

## Troubleshooting

**Error: "connect ECONNREFUSED 127.0.0.1:27017"**
- MongoDB is not running
- Use Option 1 (MongoDB Atlas) for easiest setup
- Or install MongoDB Community locally

**Connection String Issues**
- Make sure `MONGODB_URI` in `server/.env` is correct
- For MongoDB Atlas, enable IP whitelist for your IP or use "0.0.0.0/0" (dev only)

## Next Step

After MongoDB is set up and seed runs successfully:

```bash
npm run dev
```

This will start both server (http://localhost:4000) and client (http://localhost:5173).
