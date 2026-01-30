# Render Deployment Guide

## Project Structure Overview
```
Hackathon_Management_Website/
├── server/          # Node.js/Express backend
├── client/          # React/Vite frontend
└── README.md
```

## Prerequisites
- Render account (free tier available)
- GitHub repository with the code pushed
- MongoDB Atlas URI (already configured)
- Domain name (optional, Render provides free subdomains)

## Deployment Steps

### Step 1: Prepare GitHub Repository

1. **Initialize Git** (if not already done):
```bash
cd d:\3_2\Hackathon_Management_Website
git init
git add .
git commit -m "Initial commit: Hackathon Management System"
```

2. **Push to GitHub**:
   - Create a new repository on GitHub
   - Follow GitHub's instructions to push your code

### Step 2: Deploy Backend to Render

1. **Go to Render Dashboard**:
   - Visit https://dashboard.render.com
   - Click "New" → "Web Service"

2. **Connect GitHub Repository**:
   - Select "GitHub"
   - Authorize and select your hackathon repository
   - Set the root directory to `server`

3. **Configure Backend Service**:
   - **Name**: `hackathon-backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm run build && node dist/index.js`
   - **Branch**: main (or your branch)
   - **Plan**: Free tier is fine for testing

4. **Add Environment Variables**:
   Click "Environment" and add:
   ```
   NODE_ENV = production
   PORT = 4000
   MONGODB_URI = your_mongodb_atlas_uri_here
   JWT_SECRET = your_secure_random_string_here
   CLIENT_ORIGIN = https://hackathon-client.onrender.com,http://localhost:5173
   ADMIN_EMAIL = admin@hackathon.local
   ADMIN_PASSWORD = Admin@123
   TEAM_MAX_SIZE = 4
   PAYMENT_AMOUNT = 500
   ```

5. **Deploy**:
   - Click "Create Web Service"
   - Wait for deployment (2-3 minutes)
   - Note the backend URL: `https://hackathon-backend.onrender.com`

### Step 3: Deploy Frontend to Render

1. **Go to Render Dashboard**:
   - Click "New" → "Static Site"

2. **Configure Frontend**:
   - **Name**: `hackathon-client`
   - **GitHub Repository**: Select same repo
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
   - **Branch**: main

3. **Add Environment Variable**:
   - Click "Environment" and add:
   ```
   VITE_API_URL = https://hackathon-backend.onrender.com/api
   ```

4. **Deploy**:
   - Click "Create Static Site"
   - Wait for deployment
   - Note the frontend URL: `https://hackathon-client.onrender.com`

### Step 4: Update Backend Environment Variables

After frontend is deployed, update the backend's `CLIENT_ORIGIN` variable:

1. Go to backend service → Settings → Environment
2. Update `CLIENT_ORIGIN` to: `https://hackathon-client.onrender.com`
3. Backend will automatically redeploy

### Step 5: Initialize Admin User

1. Go to backend service
2. Click "Manual Deploy" or wait for automatic redeploy
3. Once deployed, run the seed script:
   - In the Render dashboard, go to your backend service
   - Click "Logs"
   - The admin user should be created automatically on first run

Alternatively, SSH into the backend and run:
```bash
npm run seed
```

## Testing the Deployment

1. **Open Frontend**:
   - Visit: `https://hackathon-client.onrender.com`
   - Should see the hackathon landing page

2. **Test Registration**:
   - Click "Register Now"
   - Fill in team details
   - Complete the flow

3. **Test Admin Panel**:
   - Click "Admin" in header
   - Login with: `admin@hackathon.local` / `Admin@123`
   - Verify dashboard loads

4. **Test API**:
   - Visit: `https://hackathon-backend.onrender.com/api/health`
   - Should return status information

## Troubleshooting

### Backend Not Starting
- Check logs in Render dashboard
- Verify MongoDB URI is correct and accessible
- Ensure all environment variables are set

### Frontend Not Loading
- Check "Logs" in Static Site settings
- Verify build command executed successfully
- Check browser console for errors

### CORS Errors
- Ensure `CLIENT_ORIGIN` in backend matches frontend URL
- Update after frontend URL is finalized

### Static Site Not Updating
- Clear browser cache (Ctrl+Shift+R)
- Check "Deploys" tab for build status
- Redeploy manually if needed

## Monitoring

- **Backend Health**: Visit `/api/health` endpoint
- **Logs**: Check Render dashboard "Logs" tab for errors
- **Builds**: Monitor "Deploys" tab for deployment status

## Production Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Admin user created (run seed script)
- [ ] CORS configured correctly
- [ ] Environment variables all set
- [ ] MongoDB connection working
- [ ] Email notifications working (if SMTP configured)
- [ ] SSL/TLS enabled (automatic with Render)

## Database Reset

If you need to reset the database:

1. Drop the MongoDB Atlas collection
2. Redeploy the backend service
3. Run seed script to create admin user again

## Scaling (Future)

When moving from free tier:
- Backend: Upgrade to Paid tier for persistent deployment
- Frontend: Static Site works great on free tier
- Consider database optimization for larger user base

## Important Notes

1. **Free Tier Limits**:
   - Services spin down after 15 minutes of inactivity
   - First request may take 30+ seconds
   - Upgrade to Paid for production use

2. **Security**:
   - Change default admin password after deployment
   - Use strong JWT_SECRET
   - Enable environment variable protection

3. **Backups**:
   - MongoDB Atlas handles backups
   - Export data regularly for safety

4. **Domain**:
   - Free Render domains available
   - Custom domain setup in Render dashboard

## Support

- Render Docs: https://render.com/docs
- GitHub Issues: Create issues in your repository
- Render Support: https://render.com/support
