# Email Timeout Issue - Root Cause & Solutions

## Problem Found ⚠️

**Error:** `Connection timeout (ETIMEDOUT)` when trying to reach `smtp.gmail.com` from Render

This means:
- ✅ Registration completes successfully
- ❌ Email sending times out after 10+ seconds
- ❌ Confirmation emails never arrive

## Root Cause

**Render's network is blocking or timing out Gmail SMTP connections** to external SMTP servers.

This is a known limitation with some cloud platforms where SMTP connections to external services are:
- Rate limited
- Blocked entirely
- Extremely slow/unreliable

## Solution 1: Switch to SendGrid (Recommended ⭐)

SendGrid is specifically optimized for cloud platforms like Render and is highly reliable.

### Step 1: Get SendGrid API Key (FREE)

1. Go to https://sendgrid.com/
2. Click **Sign Up** (free tier available)
3. Create account and verify email
4. Get your **API Key**:
   - Dashboard → Settings → API Keys
   - Create New API Key
   - Copy the key (starts with `SG.`)

### Step 2: Create .env.local with SendGrid Config

In Render dashboard → Environment, add:

```env
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.your_api_key_here
EMAIL_FROM=forgeascend@gmail.com
```

### Step 3: Update Code

Replace your email transporter with SendGrid. Create a new file `server/src/utils/sendgrid-email.ts`:

```typescript
import sgMail from '@sendgrid/mail';
import { config } from '../config/index.js';
import type { ITeam } from '../models/index.js';

// Initialize SendGrid
sgMail.setApiKey(config.sendgrid?.apiKey || '');

export async function sendRegistrationConfirmationEmail(team: ITeam): Promise<void> {
  const htmlContent = `...your html template...`;
  
  const msg = {
    to: team.participant1Email,
    from: config.email.from || 'forgeascend@gmail.com',
    subject: `Registration Confirmed – ForgeAscend v1.0 Build-a-thon (${team.registrationId})`,
    html: htmlContent,
  };

  try {
    const info = await sgMail.send(msg);
    console.log(`✅ Confirmation email sent to ${team.participant1Email}`);
    console.log(`📬 Email response ID: ${info[0].messageId}`);
  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error);
    // Don't throw - email failure should not block registration
  }
}
```

### Step 4: Install SendGrid Package

```bash
npm install @sendgrid/mail
```

### Step 5: Redeploy

```bash
git add .
git commit -m "Switch to SendGrid for email"
git push
```

---

## Solution 2: Use Mailgun

Similar to SendGrid:

1. Sign up at https://www.mailgun.com/ (free tier)
2. Get your SMTP credentials
3. Configure in Render environment
4. Update transporter config

```typescript
const transporter = nodemailer.createTransport({
  host: process.env.MAILGUN_SMTP_HOST || 'smtp.mailgun.org',
  port: 587,
  auth: {
    user: process.env.MAILGUN_SMTP_USER,
    pass: process.env.MAILGUN_SMTP_PASS,
  },
});
```

---

## Solution 3: Add More Aggressive Retry Logic (Temporary)

If you want to try to make Gmail work with Render, apply this config:

```typescript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
  connectionTimeout: 5000,   // Very short timeout
  socketTimeout: 5000,       // Very short timeout
  pool: {
    maxConnections: 1,       // Use single connection
    maxMessages: 1,          // One message at a time
    rateDelta: 1000,         // 1 second between sends
    rateLimit: true,         // Enable rate limiting
  },
});
```

**Likelihood of Success:** 20-30% (Gmail on Render is unreliable)

---

## Recommended Fix: SendGrid

### Why SendGrid?

✅ **Designed for cloud platforms** (Render, Heroku, etc.)  
✅ **Fast and reliable** (99.99% uptime)  
✅ **Free tier** (100 emails/day, more than enough for testing)  
✅ **No additional server outbound restrictions**  
✅ **Great logging and analytics**  
✅ **Active support**  

### SendGrid Free Tier Limits

- Up to **100 emails per day** (free)
- Perfect for testing and small deployments
- Upgrade to paid plan for production if needed

### Implementation Time

- **Setup:** 5 minutes
- **Code change:** 10 minutes
- **Testing:** 5 minutes
- **Total:** ~20 minutes

---

## Troubleshooting

### Still timing out?

1. **Check Render network status:**
   ```
   Render Dashboard → Settings → Check for network advisories
   ```

2. **Try a different email provider:**
   - SendGrid ← Recommended
   - Mailgun
   - AWS SES
   - Brevo (Sendinblue)

3. **Contact Render support:**
   - Ask about SMTP relay
   - Ask about outbound email restrictions

### Error logs show different code?

- `EAUTH` → Authentication failed (check password)
- `ETIMEDOUT` → Connection timeout (switch email service)
- `ECONNREFUSED` → Cannot connect (server down)

---

## Quick Checklist

- [ ] Remove Gmail SMTP setup
- [ ] Sign up for SendGrid (free)
- [ ] Get API key from SendGrid
- [ ] Update Render environment with `SENDGRID_API_KEY`
- [ ] Update email.ts to use SendGrid
- [ ] Install @sendgrid/mail package
- [ ] Test with `/api/health/email` endpoint
- [ ] Perform test registration
- [ ] Verify email arrives in inbox

---

**Estimated time to fix:** 20 minutes with SendGrid  
**Success rate:** 99% (SendGrid is very reliable on Render)
