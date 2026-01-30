# Render Deployment Checklist

## Pre-Deployment Setup

### Local Preparation
- [ ] All code committed to GitHub
- [ ] `.env` files NOT committed (use environment variables in Render instead)
- [ ] `node_modules` in `.gitignore`
- [ ] Both client and server builds succeed locally
- [ ] Admin seed script tested locally

### GitHub
- [ ] Repository created and code pushed
- [ ] Repository is public (required for free Render tier)
- [ ] No sensitive data in code/commits

### MongoDB Atlas
- [ ] MongoDB Atlas account active
- [ ] Cluster created (free tier available)
- [ ] Connection string obtained
- [ ] IP whitelist includes Render IPs (or set to 0.0.0.0/0 for testing)

## Render Deployment

### Backend Service Setup

1. **Create Web Service**
   - [ ] Connected to GitHub repository
   - [ ] Root directory: `server`
   - [ ] Build command: `npm install && npm run build`
   - [ ] Start command: `npm run start`
   - [ ] Plan: Free (for testing) or Paid (production)

2. **Environment Variables - Backend**
   - [ ] `NODE_ENV` = `production`
   - [ ] `PORT` = `4000`
   - [ ] `MONGODB_URI` = (your MongoDB Atlas connection string)
   - [ ] `JWT_SECRET` = (generate strong random string)
   - [ ] `CLIENT_ORIGIN` = (will update after frontend deployment)
   - [ ] `ADMIN_EMAIL` = `admin@hackathon.local`
   - [ ] `ADMIN_PASSWORD` = `Admin@123` (change after first login)
   - [ ] `TEAM_MAX_SIZE` = `4`
   - [ ] `PAYMENT_AMOUNT` = `500`

3. **Backend Deployment**
   - [ ] Service created and deployed
   - [ ] Deployment successful (check logs)
   - [ ] Backend URL noted (e.g., `https://hackathon-backend.onrender.com`)

### Frontend Service Setup

1. **Create Static Site**
   - [ ] Connected to GitHub repository
   - [ ] Root directory: `client`
   - [ ] Build command: `npm install && npm run build`
   - [ ] Publish directory: `dist`
   - [ ] Plan: Free tier

2. **Environment Variables - Frontend**
   - [ ] `VITE_API_URL` = `https://hackathon-backend.onrender.com/api`

3. **Frontend Deployment**
   - [ ] Service created and deployed
   - [ ] Deployment successful (check logs)
   - [ ] Frontend URL noted (e.g., `https://hackathon-client.onrender.com`)

### Post-Deployment Configuration

1. **Update Backend CORS**
   - [ ] Go to backend service settings
   - [ ] Update `CLIENT_ORIGIN` to: `https://hackathon-client.onrender.com`
   - [ ] Backend will auto-redeploy

2. **Initialize Admin User**
   - [ ] Verify admin user created (check backend logs)
   - [ ] If not, manually run seed script via SSH or backend console

3. **Verify Connectivity**
   - [ ] Backend health check: `https://hackathon-backend.onrender.com/api/health`
   - [ ] Frontend loads: `https://hackathon-client.onrender.com`
   - [ ] Check browser console for errors

## Testing Post-Deployment

### Functional Tests
- [ ] Homepage loads correctly
- [ ] Can access registration page
- [ ] Can fill and submit registration form
- [ ] Payment page displays
- [ ] Confirmation page shows after payment
- [ ] Can search teams in registration lookup
- [ ] Admin login works with credentials
- [ ] Admin dashboard loads and displays teams
- [ ] Can download Excel export
- [ ] Can view individual team details
- [ ] Can toggle team verification status
- [ ] Search functionality works in admin panel

### Technical Tests
- [ ] No CORS errors in browser console
- [ ] No 404 errors on API calls
- [ ] API responses are correct
- [ ] Database operations working (insert, read, update)
- [ ] All required fields validated
- [ ] Error handling displays user-friendly messages

### Performance Tests
- [ ] Frontend loads in <3 seconds
- [ ] Admin dashboard loads with teams
- [ ] Search completes quickly
- [ ] Excel export downloads without errors

## Security Checklist

- [ ] Changed default admin password (ADMIN_PASSWORD)
- [ ] JWT_SECRET is strong and random
- [ ] No API keys exposed in code
- [ ] HTTPS enabled (automatic with Render)
- [ ] CORS properly configured
- [ ] Rate limiting active (100 req/15min)
- [ ] MongoDB has firewall rules (whitelist Render IPs)

## Monitoring Setup

- [ ] Set up email alerts in Render (optional)
- [ ] Monitor backend logs regularly
- [ ] Check for errors in deployment logs
- [ ] Monitor MongoDB Atlas connection status
- [ ] Set budget alerts if using paid tier

## Domain Configuration (Optional)

- [ ] Custom domain purchased (optional)
- [ ] DNS records configured for Render
- [ ] SSL certificate auto-generated
- [ ] Verify domain works in browser

## Rollback Plan

- [ ] Keep GitHub commit history clean
- [ ] Tag production releases in Git
- [ ] Document deployment versions
- [ ] Know how to revert in Render dashboard

## Documentation

- [ ] Update README with deployment steps
- [ ] Document environment variables needed
- [ ] Create runbook for common operations
- [ ] Document database schema
- [ ] API documentation finalized

## Post-Launch Maintenance

### Daily
- [ ] Check error logs
- [ ] Monitor uptime

### Weekly
- [ ] Review MongoDB usage
- [ ] Check server performance metrics
- [ ] Backup data (MongoDB Atlas handles this)

### Monthly
- [ ] Review and update dependencies
- [ ] Security audit
- [ ] Performance optimization

## Emergency Contacts

- [ ] Render Support: https://render.com/support
- [ ] MongoDB Atlas Support: https://www.mongodb.com/cloud/support
- [ ] Have backup contact for GitHub account

## Important URLs (Update after deployment)

- Frontend: `https://hackathon-client.onrender.com`
- Backend API: `https://hackathon-backend.onrender.com/api`
- Admin Dashboard: `https://hackathon-client.onrender.com/admin/login`
- Admin Credentials: 
  - Email: `admin@hackathon.local`
  - Password: `Admin@123` (CHANGE THIS!)

## Notes

- Free tier services spin down after 15 minutes of inactivity
- First request after spin-down may take 30+ seconds to respond
- For production, upgrade to Paid tier ($7/month)
- Static sites don't spin down (better for frontend)

---

**Last Checked**: [Date]
**Deployment Status**: [Not Started / In Progress / Completed]
**Issues Found**: [None / List any issues]
**Next Steps**: [What to do next]
