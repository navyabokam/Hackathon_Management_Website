# Quick MongoDB Atlas Setup

## 1. Create Free MongoDB Atlas Account

Go to: https://www.mongodb.com/cloud/atlas/register

Fill in:
- Email
- Password
- First Name
- Last Name
- Company (optional)
- Accept terms
- Click "Create your Atlas account"

## 2. Create a Cluster

1. You'll be prompted to create a cluster
2. Click "Create a Deployment"
3. Select "M0" (Free tier - best for development)
4. Select region closest to you
5. Click "Create Deployment"
6. Wait 2-3 minutes for cluster to be ready

## 3. Get Connection String

1. On the dashboard, click "Connect"
2. Click "Drivers"
3. Select "Node.js" driver
4. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
   ```

## 4. Create Database User (if not auto-created)

1. Go to "Database Access" in left menu
2. Click "Add New Database User"
3. Create username and password
4. Select "Read and write to any database"
5. Click "Add User"
6. Note: Use this username/password in connection string

## 5. Allow Your IP

1. Go to "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Add Current IP Address" (or use 0.0.0.0/0 for development)
4. Click "Confirm"

## 6. Update Your .env File

Update `server/.env`:

Replace this line:
```
MONGODB_URI=mongodb://localhost:27017/hackathon
```

With your MongoDB Atlas connection string:
```
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hackathon?retryWrites=true&w=majority
```

**Important:** Replace `username` and `password` with your actual credentials!

## 7. Run the Seed Script

```bash
npm run seed
```

You should see:
```
✓ Admin user created: admin@hackathon.local
Database initialized successfully!
```

## 8. Start Development

```bash
npm run dev
```

Both server and client will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:4000

## Troubleshooting

**Error: "authentication failed"**
- Check username/password in connection string
- Make sure they match what you created in MongoDB Atlas

**Error: "IP not whitelisted"**
- Go to "Network Access" in MongoDB Atlas
- Add your current IP or use 0.0.0.0/0

**Connection string not working**
- Copy directly from MongoDB Atlas (not from this guide)
- Make sure to include the full string with username and password

## Next Steps


Go to: http://localhost:5173/admin/login

Happy hacking! 🚀
