# Render Deployment - Important Notes

## Environment Variables Explained

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Runtime environment | `production` |
| `PORT` | Server port | `4000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | JWT signing secret (keep secure!) | Generate random 64+ chars |
| `CLIENT_ORIGIN` | Allowed CORS origins | `https://hackathon-client.onrender.com` |
| `ADMIN_EMAIL` | Default admin email | `admin@hackathon.local` |
| `ADMIN_PASSWORD` | Default admin password | Change after first login! |
| `TEAM_MAX_SIZE` | Max team members | `4` |
| `PAYMENT_AMOUNT` | Registration fee | `500` |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `https://hackathon-backend.onrender.com/api` |

## Getting MongoDB URI from MongoDB Atlas

1. **Log in to MongoDB Atlas**: https://account.mongodb.com/account/login
2. **Click "Connect"** on your cluster
3. **Select "Connect with the MongoDB Shell"**
4. **Copy the connection string**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/hackathon?retryWrites=true&w=majority
   ```
5. **Replace `password` with your actual MongoDB password**
6. **Paste into `MONGODB_URI` in Render**

## Generating JWT_SECRET

You need a strong random string for JWT_SECRET. Generate one:

**Option 1**: Online (https://generate-random.org)
- Select "Random string"
- Set length to 64 characters
- Copy and use

**Option 2**: Command line
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 3**: Use any strong password generator

## Whitelisting Render IPs in MongoDB Atlas

1. **Go to MongoDB Atlas**: https://cloud.mongodb.com
2. **Click "Network Access"**
3. **Click "Add IP Address"**
4. **Option A** (Easiest for testing): 
   - Add `0.0.0.0/0` (allows all IPs)
   - ⚠️ Only use for testing! Not secure for production.

5. **Option B** (Recommended):
   - Find Render's IP ranges (changes dynamically)
   - Add them individually
   - Contact Render support for latest IPs

## Project Structure for Render

```
hackathon/
├── server/
│   ├── src/
│   │   ├── index.ts          (Entry point)
│   │   ├── config/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── schemas/
│   ├── dist/                 (Built files - not in git)
│   ├── package.json
│   ├── tsconfig.json
│   └── .gitignore
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   └── App.tsx
│   ├── dist/                 (Built files - not in git)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── .gitignore
│
├── .gitignore                (Root level)
├── render.yaml
├── QUICK_DEPLOY.md
└── README.md
```

## .gitignore Checklist

Make sure your `.gitignore` includes:
```
# Dependencies
node_modules/
package-lock.json
yarn.lock

# Build outputs
dist/
build/

# Environment
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log
```

## Build Commands Explained

### Backend
```bash
npm install              # Install dependencies
npm run build           # Compile TypeScript to JavaScript (src/ → dist/)
npm run start           # Run the compiled backend
npm run seed            # Initialize admin user in MongoDB
```

### Frontend
```bash
npm install             # Install dependencies
npm run build          # Build Vite app (src/ → dist/)
npm run dev            # Development server (local only)
npm run preview        # Preview production build locally
```

## Deployment Process

```
1. User pushes code to GitHub
   ↓
2. Render detects change
   ↓
3. Render clones repo
   ↓
4. Render runs build command
   - Backend: npm install && npm run build
   - Frontend: npm install && npm run build
   ↓
5. Render runs start command (backend only)
   - npm run start (runs dist/index.js)
   ↓
6. Render serves frontend (static files in dist/)
   ↓
7. Service goes live at unique URL
```

## Monitoring & Logs

### View Backend Logs
1. Go to https://dashboard.render.com
2. Click **hackathon-backend** service
3. Click **Logs** tab
4. Scroll to see real-time logs

### View Frontend Build Logs
1. Go to https://dashboard.render.com
2. Click **hackathon-client** service
3. Click **Deploys** tab
4. Click on a deployment to see build output

## Common Issues & Solutions

### Issue: "Build failed"
**Solution**:
1. Check logs for error message
2. Verify build command is correct
3. Ensure all dependencies are in package.json
4. Check Node version compatibility

### Issue: "Service crashed"
**Solution**:
1. Check logs for crash reason
2. Verify all environment variables are set
3. Check MongoDB connection string
4. Redeploy or restart service

### Issue: "Blank page on frontend"
**Solution**:
1. Check browser console (F12) for errors
2. Verify VITE_API_URL is correct
3. Check network tab for failed API calls
4. Verify backend is accessible

### Issue: "API calls failing with 401"
**Solution**:
1. Check JWT_SECRET is set in backend
2. Verify CLIENT_ORIGIN matches frontend URL
3. Check MongoDB is running
4. Verify admin user exists

### Issue: "Cold start delays (30+ seconds)"
**Solution**:
- This is normal on free tier
- Service spins down after 15 mins of inactivity
- Upgrade to paid tier ($7/month) for always-on

## Security Best Practices

1. **Change Default Credentials**
   - Admin password: `Admin@123` → YOUR_STRONG_PASSWORD
   - Update in Render environment variables

2. **JWT_SECRET**
   - Use strong random string (64+ characters)
   - Never expose in logs or code
   - Rotate periodically in production

3. **MongoDB Access**
   - Use strong username/password
   - Enable IP whitelist (not 0.0.0.0/0 in production)
   - Use encryption in transit (TLS)

4. **CORS Configuration**
   - Only allow your frontend domain
   - Don't use wildcard (*) in production
   - Verify CLIENT_ORIGIN is correct

5. **Rate Limiting**
   - Already enabled (100 req/15min)
   - Monitor for abuse
   - Increase if needed for legitimate traffic

## Cost Estimation

| Service | Free Tier | Paid Tier (Monthly) |
|---------|-----------|-------------------|
| Backend | $0 (spins down) | $7+ |
| Frontend | $0 (always on) | $0 (included) |
| MongoDB | $0 (free cluster) | Varies by usage |
| **Total** | **$0** | **$7+** |

**Free Tier Limitations**:
- Services spin down after 15 mins inactivity
- First request takes 30+ seconds
- Limited compute resources
- Good for testing/demo

**Paid Tier Benefits**:
- Always-on deployment
- Better performance
- Priority support
- Suitable for production

## Next Steps After Deployment

1. ✅ Verify all services running
2. ✅ Test complete user flow
3. ✅ Change admin password
4. ✅ Set up monitoring (optional)
5. ✅ Configure custom domain (optional)
6. ✅ Upgrade to paid tier (if production)
7. ✅ Document deployment in README
8. ✅ Set up CI/CD pipeline (optional)

## Rollback Procedure

If you need to revert to a previous version:

1. **In Render Dashboard**:
   - Go to service
   - Click "Deploys" tab
   - Click "Revert" on previous deploy

2. **Or push old code to GitHub**:
   - Git checkout previous commit
   - Push to main branch
   - Render auto-redeploys

## Still Having Issues?

1. **Check Render Status**: https://status.render.com
2. **Review Logs**: Dashboard → Service → Logs
3. **Read Docs**: https://render.com/docs
4. **Contact Support**: https://render.com/support
5. **GitHub Issues**: Create issue in repo for tracking

## Useful Links

- **Render Dashboard**: https://dashboard.render.com
- **MongoDB Atlas**: https://cloud.mongodb.com
- **Render Docs**: https://render.com/docs
- **Node.js Docs**: https://nodejs.org/docs
- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Express Docs**: https://expressjs.com

---

**Last Updated**: January 30, 2026
**Status**: Ready for Deployment ✅
**Estimated Deploy Time**: 15-20 minutes
