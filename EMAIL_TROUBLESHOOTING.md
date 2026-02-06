# Email Troubleshooting Guide - Render Deployment

## Problem Summary
Emails are being sent successfully in local development but **failing silently in the Render production environment**. The registration process completes, but no confirmation emails are received.

## Root Causes Identified

### 1. **No SMTP Connection Verification at Startup** ⚠️ PRIMARY ISSUE
- The email transporter was created but never verified
- Errors were happening silently in catch blocks
- In production, SMTP failures weren't being properly logged/diagnosed

### 2. **Gmail Authentication Issues in Production**
- Gmail requires an "App Password" (16-character password), NOT your regular Gmail password
- The `EMAIL_PASS` you provided might not be a proper Gmail App Password
- Gmail may block authentication if not configured correctly for external apps

### 3. **Missing Error Diagnostics**
- Console logs might not be captured or visible in Render dashboard
- Silent email failures meant you had no way to diagnose the problem

## How the Fix Works

The following improvements have been implemented:

### ✅ **1. SMTP Connection Verification** (email.ts)
```typescript
// Verify SMTP connection on module load
async function verifyEmailConfig(): Promise<void> {
  try {
    await transporter.verify();
    console.log('✅ Email service connected successfully');
    // ... logs configuration
  } catch (error) {
    console.error('❌ CRITICAL: Email service failed to connect!');
    // ... detailed error logging
  }
}
```

### ✅ **2. Detailed Error Logging**
All email sending functions now log:
- Email response ID (success confirmation)
- Error type and code
- Recipient address
- Full error message

### ✅ **3. Email Diagnostics Endpoint** (health.ts)
```
GET /api/health/email
```
Returns detailed email configuration status:
```json
{
  "emailConfigured": true/false,
  "smtpConnection": true/false,
  "emailUser": "forgeascend@gmail.com",
  "emailPassLength": 16,
  "errors": [],
  "message": "✅ Email service is healthy"
}
```

### ✅ **4. Startup Configuration Logging** (index.ts)
Server startup now displays email configuration status clearly:
```
📧 EMAIL CONFIGURATION:
  ✓ Email user: forgeascend@gmail.com
  ✓ Email password: 16 characters
  💡 Check /api/health/email endpoint for detailed email diagnostics
```

## Troubleshooting Steps

### Step 1: Check Email Configuration in Render
Go to your Render dashboard → Environment Variables and verify:

| Variable | Value | Notes |
|----------|-------|-------|
| `EMAIL_USER` | forgeascend@gmail.com | Gmail address |
| `EMAIL_PASS` | yvwrhttmzxfbjbye | **This MUST be a Gmail App Password** |

### Step 2: Generate or Verify Gmail App Password

**Gmail App Passwords are NOT your regular password.** Follow these steps:

1. **Go to Google Account** → https://myaccount.google.com/
2. **Enable 2-Factor Authentication** (required for App Passwords)
   - Left sidebar → Security
   - Look for "2-Step Verification" and enable it if not already enabled
3. **Generate App Password**
   - Still in Security → "App passwords" (near the bottom)
   - Select "Mail" and "Windows Computer"
   - Google will generate a 16-character password
   - **Copy this password** (it includes spaces - remove them)

4. **Update Render Environment Variable**
   - Go to Render dashboard → Environment
   - Replace `EMAIL_PASS` with your new 16-character App Password
   - Don't include spaces: `yvwrhttmzxfbjbye` (correct) not `yv wr ht tm zx fb jb ye` (incorrect)

### Step 3: Test Email Configuration

After updating, redeploy and check:

```
# Check server startup logs for:
📧 EMAIL CONFIGURATION:
  ✓ Email user: forgeascend@gmail.com
  ✓ Email password: 16 characters
  ✓ Email service connected successfully ← This should appear
```

### Step 4: Use Diagnostics Endpoint

Once deployed, visit:
```
https://your-render-app.onrender.com/api/health/email
```

Expected response if working:
```json
{
  "emailConfigured": true,
  "smtpConnection": true,
  "emailUser": "forgeascend@gmail.com",
  "emailPassLength": 16,
  "errors": [],
  "message": "✅ Email service is healthy"
}
```

### Step 5: Check Render Logs

In Render dashboard → Logs, look for:

**✅ Success indicators:**
```
✅ Email service connected successfully
✅ Confirmation email sent to user@example.com
📬 Email response ID: <message-id>
```

**❌ Error indicators:**
```
❌ CRITICAL: Email service failed to connect!
Error message: Invalid login
Error code: EAUTH
```

## Common Issues & Solutions

### Issue: "Invalid login" or EAUTH error
**Cause:** Wrong password format or not an App Password  
**Solution:** 
- Generate a new Gmail App Password (16 characters)
- Remove any spaces from the password
- Update Render environment variable

### Issue: "Less secure app access" error
**Cause:** Gmail security settings blocking the connection  
**Solution:**
- Use Gmail App Passwords (see Step 2 above)
- DO NOT enable "Less secure app access" - it's deprecated

### Issue: "timeout" or connection issues
**Cause:** SMTP connection problems in production  
**Solution:**
- Check Render's outbound connectivity
- Try a different SMTP provider (SendGrid, Mailgun, etc.)
- Contact Render support if outbound SMTP is blocked

### Issue: Email still not sending after fixes
**Solution:**
- Check `/api/health/email` endpoint - should return detailed error
- Review Render logs for exact error message
- Verify EMAIL_USER is correct email address
- Confirm EMAIL_PASS is exactly the 16-character App Password (no spaces)

## Alternative: Use a Different Email Service

If Gmail continues to have issues, consider:

### Option 1: SendGrid (Free tier available)
```typescript
const transporter = nodemailer.createTransport({
  host: process.env.SENDGRID_HOST || 'smtp.sendgrid.net',
  port: 587,
  auth: {
    user: 'apikey',
    pass: process.env.SENDGRID_API_KEY,
  },
});
```

### Option 2: Mailgun
```typescript
const transporter = nodemailer.createTransport({
  host: process.env.MAILGUN_HOST,
  port: 587,
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASS,
  },
});
```

## Verification Checklist

- [ ] Email configuration variables set in Render
- [ ] EMAIL_PASS is a valid Gmail App Password (16 chars)
- [ ] Server startup shows "Email service connected successfully"
- [ ] `/api/health/email` returns 200 status with healthy status
- [ ] Test registration sends confirmation email
- [ ] Production logs show "✅ Confirmation email sent to..."

## Additional Resources

- [Gmail App Passwords Guide](https://support.google.com/accounts/answer/185833)
- [Nodemailer Gmail Documentation](https://nodemailer.com/smtp/gmail/)
- [Render Environment Variables](https://render.com/docs/environment-variables)

---

**Last Updated:** February 2026  
**Status:** Emails now have full diagnostics and verification
