# 📧 Email Configuration Guide

## Overview
The hackathon registration system now sends automatic confirmation emails from `forgeascend@gmail.com` to team leaders after successful registration.

---

## 🔐 Setup Instructions

### Step 1: Get Gmail App Password

1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to **Security** (left sidebar)
3. Find **App passwords** (requires 2-factor authentication enabled)
4. Select **Mail** and **Windows Computer** (or your device)
5. Google will generate a 16-character password
6. **Copy this password** - you'll use it in `.env`

### Step 2: Update `.env` File

Add these lines to your `.env` file in the `server/` directory:

```env
# Email Configuration (Gmail)
EMAIL_USER=forgeascend@gmail.com
EMAIL_PASS=your_16_character_app_password_here
```

**Example:**
```env
EMAIL_USER=forgeascend@gmail.com
EMAIL_PASS=abcd efgh ijkl mnop
```

⚠️ **Important:**
- Use the **App Password**, NOT your regular Gmail password
- The app password has spaces - include them exactly as provided by Google
- Never commit this file to version control
- Keep your `.env` file secure

---

## 📨 Email Flow

```
User submits registration form
          ↓
Backend saves team in MongoDB
          ↓
Team status = CONFIRMED
          ↓
Email sent from forgeascend@gmail.com
    to team.participant1Email
          ↓
Email includes:
  - Registration ID (prominent)
  - Team name, college, size
  - Team leader info (name, email, phone)
  - All team members (if applicable)
  - Payment UTR/reference
  - Status
          ↓
Confirmation page shown to user
```

---

## ✉️ Email Content

### Subject
```
Hackathon Registration Confirmed – HACK-2026-XXXXXX
```

### Template Features
- ✅ Responsive design (works on mobile/desktop)
- ✅ Gradient header with branding
- ✅ Prominent registration ID display
- ✅ All team member details
- ✅ Team leader highlighted as LEADER badge
- ✅ Payment confirmation
- ✅ Important day-of instructions
- ✅ Professional footer

### Recipients
- **Primary:** Team leader email (`participant1Email`)
- **Only one email per team** (to avoid spam)

---

## 🧪 Testing

### Local Development
In development mode, emails are logged to console instead of actually sent:

```bash
npm start
# Check console logs for email content
```

### Production (Render/Deployed)
With proper `.env` variables set, emails are sent via Gmail SMTP.

---

## 🐛 Troubleshooting

### "Invalid login credentials"
- ❌ You used your regular Gmail password
- ✅ Use the **App Password** from Google Account settings
- ✅ Check spelling and spaces are included

### "Less secure app access denied"
- Gmail blocked your app
- ✅ Use **App Passwords** instead (more secure)
- ✅ Enable 2-factor authentication

### "Email not received"
- Check spam/promotions folder
- Verify `participant1Email` is in the database
- Check backend logs for errors
- Try sending test email manually

### "EAUTH authentication failure"
- ❌ Wrong credentials
- ✅ Verify `.env` values match exactly
- ✅ Try regenerating App Password in Google Account

---

## 📋 Configuration Checklist

- [ ] Gmail account is forgeascend@gmail.com
- [ ] 2-factor authentication enabled on Gmail
- [ ] App Password generated from Google Account settings
- [ ] `.env` file in `server/` directory
- [ ] `EMAIL_USER` set to `forgeascend@gmail.com`
- [ ] `EMAIL_PASS` set to 16-character app password
- [ ] `.env` added to `.gitignore` (don't commit!)
- [ ] Backend restarted after `.env` changes
- [ ] Test registration to verify email is sent

---

## 🚀 Deployment (Render)

### Environment Variables in Render

1. Go to your **Web Service** → **Environment**
2. Add these variables:
   ```
   EMAIL_USER=forgeascend@gmail.com
   EMAIL_PASS=your_16_character_app_password_here
   ```
3. Save and redeploy

**Never commit credentials to git!**

---

## 📧 Code Structure

### Files Modified
- `server/src/utils/email.ts` - Email utilities with Gmail transporter
- `server/src/config/index.ts` - Email config from `.env`
- `server/src/services/team.service.ts` - Send email on registration
- `server/.env` (create this file) - Credentials

### Key Functions
- `sendRegistrationConfirmationEmail(team)` - Main function, called after registration
- `sendConfirmationEmail()` - Backward compatible wrapper

---

## 🔔 Email Reliability

### Important Design Decisions
- ✅ **Non-blocking:** Email failure does NOT break registration
- ✅ **Logged:** Failed emails are logged for debugging
- ✅ **Graceful:** User gets confirmation page regardless
- ✅ **Async:** Email sent after DB save is complete

### What happens if email fails?
```
Registration succeeds ✅
User sees confirmation page with ID ✅
Email fails to send 📧❌
Error is logged for admin to see
User can still access /lookup with ID
```

---

## 📞 Support

If emails aren't sending:
1. Check `.env` file has correct credentials
2. Check backend logs for email errors
3. Verify Gmail account can send emails
4. Test with a simple registration
5. Check spam folder

For questions about the email implementation, review `server/src/utils/email.ts`.
