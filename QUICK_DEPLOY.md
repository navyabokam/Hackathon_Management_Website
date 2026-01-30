# Quick Start: Deploy to Render in 5 Minutes

## Step 1: Push Code to GitHub (5 mins)

```bash
cd d:\3_2\Hackathon_Management_Website
git init
git add .
git commit -m "College Hackathon Management System"
git remote add origin https://github.com/YOUR_USERNAME/hackathon.git
git push -u origin main
```

## Step 2: Deploy Backend (5 mins)

1. Go to https://dashboard.render.com
2. Click **New** → **Web Service**
3. **Connect Repository**:
   - Select your hackathon repository
   - Click **Connect**

4. **Configure**:
   - Name: `hackathon-backend`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Root Directory: `server`
   - Plan: **Free** (or Paid)
   - Region: `Oregon` (free tier)

5. **Add Environment Variables**:
   Click **Advanced** → **Add Environment Variable**:
   
   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `4000` |
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | Generate a random string (64 chars) |
   | `CLIENT_ORIGIN` | `https://hackathon-client.onrender.com` |
   | `ADMIN_EMAIL` | `admin@hackathon.local` |
   | `ADMIN_PASSWORD` | `Admin@123` |
   | `TEAM_MAX_SIZE` | `4` |
   | `PAYMENT_AMOUNT` | `500` |

6. Click **Create Web Service**
7. Wait for deployment (2-3 mins)
8. **Copy Backend URL**: `https://hackathon-backend-xxxxx.onrender.com`

## Step 3: Deploy Frontend (5 mins)

1. In Render Dashboard, click **New** → **Static Site**
2. **Connect Repository**:
   - Select same hackathon repository
   - Click **Connect**

3. **Configure**:
   - Name: `hackathon-client`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
   - Root Directory: `client`
   - Region: `Oregon`

4. **Add Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://hackathon-backend-xxxxx.onrender.com/api` (replace xxxxx with your backend ID)

5. Click **Create Static Site**
6. Wait for deployment (2-3 mins)
7. **Copy Frontend URL**: `https://hackathon-client-xxxxx.onrender.com`

## Step 4: Final Configuration (2 mins)

1. **Update Backend CORS** (required!):
   - Go back to **hackathon-backend** service
   - Click **Settings** → **Environment**
   - Find `CLIENT_ORIGIN` variable
   - Update to: `https://hackathon-client-xxxxx.onrender.com` (your frontend URL)
   - Click **Save**
   - Backend will redeploy automatically

## Step 5: Test Your Deployment (2 mins)

### Test Backend
```bash
curl https://hackathon-backend-xxxxx.onrender.com/api/health
```
Should return:
```json
{"status": "ok", "timestamp": "...", "uptime": "..."}
```

### Test Frontend
Open in browser: `https://hackathon-client-xxxxx.onrender.com`
- Should see the hackathon landing page
- All links should work

### Test Admin Panel
- Go to: `https://hackathon-client-xxxxx.onrender.com/admin/login`
- Login with: 
  - Email: `admin@hackathon.local`
  - Password: `Admin@123`
- Should see dashboard with teams

## Troubleshooting

### Backend Not Starting
```
Check logs:
1. Go to hackathon-backend service
2. Click "Logs" tab
3. Look for error messages
Common causes:
- MongoDB URI incorrect
- Missing environment variables
```

### Frontend Shows Blank Page
```
Check logs:
1. Go to hackathon-client service
2. Click "Logs" tab
3. Check browser console (F12)
Usually because API_URL is wrong
```

### CORS Errors
```
Make sure CLIENT_ORIGIN in backend matches frontend URL
Redeploy backend after updating
```

## Environment Variables Reference

### Backend (.env format for reference)
```
NODE_ENV=production
PORT=4000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/hackathon
JWT_SECRET=your_secret_key_here_64_characters_long
CLIENT_ORIGIN=https://hackathon-client.onrender.com
ADMIN_EMAIL=admin@hackathon.local
ADMIN_PASSWORD=Admin@123
TEAM_MAX_SIZE=4
PAYMENT_AMOUNT=500
```

### Frontend (.env.local format for reference)
```
VITE_API_URL=https://hackathon-backend.onrender.com/api
```

## Next Steps

1. **Change Admin Password**
   - Log in to admin dashboard
   - Update password for security

2. **Configure Email** (Optional)
   - Set up SMTP in backend environment variables
   - Uncomment email sending in code

3. **Custom Domain** (Optional)
   - Buy domain from GoDaddy, Namecheap, etc.
   - Configure DNS in Render dashboard
   - SSL certificate auto-generated

4. **Upgrade to Paid** (When Ready)
   - Free tier spins down after 15 mins
   - Paid tier: $7/month, always running
   - Includes better performance

## Important Notes

✅ **Enabled by Default**:
- HTTPS/SSL
- Rate limiting (100 req/15min)
- Error handling
- Database connection pooling

⚠️ **Don't Forget**:
- Change admin password
- Use strong JWT_SECRET
- Whitelist Render IPs in MongoDB Atlas
- Update frontend API URL after backend deployment

🚀 **Deployment Time**: ~15-20 minutes total
📊 **Cost**: Free tier for testing, $7-15/month for production

## Support

- **Render Docs**: https://render.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com
- **Project Issues**: GitHub Issues
- **Render Support**: https://render.com/support

---

**Deployment Status**: Ready to deploy ✅
**All files**: Committed to GitHub ✅
**Environment variables**: Configured ✅
