# Quick Fix for Email Not Sending in Render

## The Problem
✉️ Emails work locally but fail silently in Render production

## The Root Cause
Your `EMAIL_PASS` is likely **not a valid Gmail App Password**. Gmail requires:
- A 16-character special password (not your regular Gmail password)
- 2-Factor Authentication enabled on your Google account
- Proper authentication configuration

## Immediate Action Items

### 1️⃣ Generate Gmail App Password (5 minutes)
1. Go to https://myaccount.google.com/
2. Click **Security** in left sidebar
3. Enable **2-Step Verification** if not enabled (you'll get prompted)
4. Find **App passwords** section (near bottom)
5. Select **Mail** and say you're using **Windows Computer**
6. Google generates a 16-character password - **COPY IT**
7. Remove any spaces from the password

Example: `yvwrhttmzxfbjbye` (yours might look different)

### 2️⃣ Update Render Environment Variable
1. Go to Render Dashboard → Your App
2. Click **Environment** on the left
3. Find `EMAIL_PASS`
4. **Replace** the current value with your **new 16-character App Password**
5. Keep `EMAIL_USER` as `forgeascend@gmail.com`

### 3️⃣ Redeploy
1. In Render → **Manual Deploy** → Redeploy Latest Commit
2. Wait for deployment to complete

### 4️⃣ Verify It Works

**Check Render Logs:**
```
Open Render Dashboard → Logs
Look for these success messages:
✅ Email service connected successfully
✅ Confirmation email sent to user@example.com
📬 Email response ID: (some ID)
```

**Or Test the Endpoint:**
```
Open in browser:
https://your-app-name.onrender.com/api/health/email

Should show:
{
  "emailConfigured": true,
  "smtpConnection": true,
  "message": "✅ Email service is healthy"
}
```

### 5️⃣ Test Registration
1. Go to your hackathon website
2. Complete a registration
3. Check if confirmation email arrives within 1-2 minutes

## If Still Not Working

### Check These Things:
1. **Gmail App Password correct?** - It's 16 characters with NO spaces
2. **Correct email?** - EMAIL_USER should be `forgeascend@gmail.com`
3. **2FA enabled?** - Gmail requires this for App Passwords
4. **Check endpoint** - Visit `/api/health/email` to see exact error

### Look at Error Messages in Logs:
If you see:
- `❌ Invalid login` → Wrong App Password
- `❌ timeout` → Network/firewall issue
- `❌ not a Gmail account` → Wrong EMAIL_USER

## Detailed Guide
See [EMAIL_TROUBLESHOOTING.md](./EMAIL_TROUBLESHOOTING.md) for comprehensive troubleshooting

## Quick Checklist
- [ ] Gmail App Password generated (16 chars, no spaces)
- [ ] Render `EMAIL_PASS` updated with new App Password
- [ ] App redeployed
- [ ] Logs show "Email service connected successfully"
- [ ] `/api/health/email` endpoint shows healthy
- [ ] Test registration receives confirmation email

---

**Time to fix:** ~10 minutes  
**Success rate:** 95% (if Gmail App Password is correct)
