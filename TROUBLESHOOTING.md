# Troubleshooting Guide

## Issue 1: Admin Login Not Working

### Symptoms
- Login form rejects credentials
- "Invalid credentials" error message

### Solutions

**Step 1: Verify Admin User was Created**
```bash
npm run seed
```

Expected output:
```
✓ Admin user created: admin@hackathon.local
✓ Seed completed
```

**Step 2: Check MongoDB Connection**
- Verify your `server/.env` has correct `MONGODB_URI`
- Go to MongoDB Atlas → "Network Access" → Check your IP is whitelisted
- Test connection: Can you access MongoDB Atlas from your IP?

**Step 3: Clear Browser Cache**
- Open DevTools (F12)
- Application → Cookies → Delete all cookies for localhost
- Application → Local Storage → Clear all
- Reload page

**Step 4: Verify JWT Secret**
In `server/.env`:
```
JWT_SECRET=change_me_in_production_to_a_secure_random_string
```
Make sure it's not empty.

**Step 5: Check Server Logs**
- Look at your server terminal for error messages
- Should see: `✓ Connected to MongoDB`

---

## Issue 2: Payment Button Returns 500 Error

### Symptoms
- Click "Success" or "Fail" button
- Get error: "500 Internal Server Error"

### Solutions

**Step 1: Check Backend Logs**
Look at your server terminal - you should see error details.

Common errors:
- `Email sending failed` → Email configuration issue (but payment should still work)
- `Team not found` → Registration ID issue
- `MongoDB connection error` → Database connection issue

**Step 2: Verify Team Registration Works**
1. Register a new team on the frontend
2. Check that registration completes successfully
3. Note the Registration ID shown
4. Use that exact Registration ID on payment page

**Step 3: Check MongoDB Atlas**
- Go to MongoDB Atlas
- Click "Browse Collections"
- Check `hackathon` database has data:
  - `teams` collection (should have your registered team)
  - `payments` collection (should have payment record)
  - `adminusers` collection (should have admin@hackathon.local)

**Step 4: Fix Email Configuration** (if that's the issue)
The payment should work even if email fails. But to fix email:

In `server/.env`:
```
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
NODE_ENV=development
```

In development mode, emails are logged to console, not sent.

**Step 5: Restart Servers**
The servers auto-reload in watch mode, but if issues persist:
1. Stop both servers (Ctrl+C in each terminal)
2. Run: `npm run dev`

---

## Issue 3: Servers Won't Start

### Error: "Port already in use"

```bash
# Kill process on port 4000 (backend)
powershell -NoProfile -ExecutionPolicy Bypass -Command "Stop-Process -Name node -Force -ErrorAction SilentlyContinue"

# Or change ports in .env
# PORT=4001
# And in client vite.config.ts proxy target: 'http://localhost:4001'
```

### Error: "Cannot find module"

```bash
# Reinstall dependencies
cd server && npm install
cd ../client && npm install
cd ..
```

---

## Issue 4: MongoDB Connection Failed

### Error: "ECONNREFUSED 127.0.0.1:27017"

**Solution: Use MongoDB Atlas (Cloud)**

1. Sign up: https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `server/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxx.mongodb.net/hackathon?retryWrites=true&w=majority
   ```

### Error: "IP not whitelisted"

In MongoDB Atlas:
1. Click "Network Access" in left sidebar
2. Click "Add IP Address"
3. Select "Add Current IP Address"
4. Or use `0.0.0.0/0` for development only
5. Click "Confirm"

---

## Issue 5: Admin Dashboard Not Loading

### Symptoms
- Page shows "Loading..." forever
- Or blank page

### Solutions

**Step 1: Check Network Tab**
- Open DevTools (F12)
- Go to "Network" tab
- Reload page
- Check for red (failed) requests
- Click on failed requests to see error details

**Step 2: Verify Auth Token**
In DevTools Console:
```javascript
document.cookie
```
Should show `authToken` if logged in.

**Step 3: Check Team Data**
Go to MongoDB Atlas → Browse Collections → `teams` collection
- Should have at least one team
- Check `status` field is valid (e.g., "PENDING" or "CONFIRMED")

---

## Debug Checklist

- [ ] `npm run seed` ran successfully
- [ ] MongoDB Atlas cluster is running
- [ ] Your IP is whitelisted in MongoDB Atlas
- [ ] `.env` file has valid `MONGODB_URI`
- [ ] Both server and client are running
- [ ] No errors in server terminal
- [ ] Browser DevTools Network tab shows successful requests
- [ ] Browser cookies have `authToken` after login

---

## Quick Test Workflow

1. **Register Team**
   - Go to http://localhost:5173
   - Fill team registration form
   - Submit
   - Note the Registration ID

2. **Make Payment**
   - On confirmation page, click "Go to Payment"
   - Click "Simulate Success" button
   - Should show success page with Registration ID

3. **Admin Login**
   - Go to http://localhost:5173/admin/login
   - Email: `admin@hackathon.local`
   - Password: `Admin@123`
   - Should see team list

4. **Verify Team**
   - Click on registered team
   - Click "Mark as Verified"
   - Go back to list - status should show as "Verified"

---

## Still Having Issues?

**Check these logs:**

In server terminal:
```
✓ Connected to MongoDB
✓ Server running on port 4000
```

In client terminal:
```
VITE v5.4.21  ready in XXX ms
Local:   http://localhost:5173/
```

**If you see errors, try:**

```bash
# Clear node modules and reinstall
cd server && rm -r node_modules && npm install
cd ../client && rm -r node_modules && npm install

# Check Node version
node --version
# Should be v20 or higher

# Check npm version  
npm --version
# Should be v10 or higher
```

**Need more help?**
- Check browser console (F12) for JavaScript errors
- Check network requests in DevTools
- Check MongoDB Atlas logs
- Ensure all environment variables are correct
