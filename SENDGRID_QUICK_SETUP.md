# Switch to SendGrid in 20 Minutes ⚡

The Gmail SMTP timeout issue on Render is due to **network connectivity**, not authentication. SendGrid solves this.

## Why SendGrid?
- ✅ Built for cloud platforms (Render, Heroku, etc.)
- ✅ Super fast and reliable
- ✅ Free tier: 100 emails/day
- ✅ No outbound network restrictions on Render

---

## Quick Setup (20 minutes)

### 1️⃣ Get SendGrid API Key (5 min)

1. Go to https://sendgrid.com/
2. Click **Sign Up**
3. Complete registration and verify email
4. Go to **Settings → API Keys**
5. Click **Create API Key**
6. Select **Full Access** → **Create**
7. **Copy the key** - looks like: `SG.xxx...xxx`
8. **Save it** - you'll only see it once!

### 2️⃣ Update Render Environment (2 min)

In **Render Dashboard**:
1. Go to your app
2. Click **Environment** on left
3. DELETE these variables:
   - `EMAIL_USER`
   - `EMAIL_PASS`
   - `SMTP_HOST`
   - `SMTP_PORT`

4. ADD these variables:
   ```
   EMAIL_PROVIDER=sendgrid
   SENDGRID_API_KEY=SG.xxx_paste_your_key_here
   EMAIL_FROM=forgeascend@gmail.com
   ```

5. Click **Save**

### 3️⃣ Install Package (1 min)

In your terminal:
```bash
cd server
npm install @sendgrid/mail
cd ..
```

Then in root:
```bash
git add package-lock.json server/package.json
git commit -m "Add SendGrid package"
git push
```

### 4️⃣ Update Config File (2 min)

Edit `server/src/config/index.ts`:

```typescript
export const config = {
  // ... existing config ...
  email: {
    // Old Gmail config (DELETE)
    // user: process.env.EMAIL_USER,
    // pass: process.env.EMAIL_PASS,
    
    // New SendGrid config (ADD)
    provider: process.env.EMAIL_PROVIDER || 'gmail',
    from: process.env.EMAIL_FROM || 'forgeascend@gmail.com',
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
  },
};
```

### 5️⃣ Update Email Service (5 min)

Replace `server/src/utils/email.ts` with this updated version:

```typescript
import sgMail from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import { config } from '../config/index.js';
import type { ITeam } from '../models/index.js';

// Initialize SendGrid
if (config.sendgrid?.apiKey) {
  sgMail.setApiKey(config.sendgrid.apiKey);
}

// Helper function to send emails with retry logic
async function sendEmailWithRetry(mailOptions: any, maxRetries = 2): Promise<any> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`📧 Email attempt ${attempt}/${maxRetries}: ${mailOptions.to}`);
      
      // Use SendGrid if API key configured, else fallback to nodemailer
      if (config.sendgrid?.apiKey) {
        const msg = {
          to: mailOptions.to,
          from: mailOptions.from,
          subject: mailOptions.subject,
          html: mailOptions.html,
        };
        const response = await sgMail.send(msg);
        return response;
      } else {
        // Fallback to nodemailer (old method)
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: config.email.user,
            pass: config.email.pass,
          },
          connectionTimeout: 10000,
          socketTimeout: 10000,
        });
        return await transporter.sendMail(mailOptions);
      }
    } catch (error) {
      lastError = error as Error;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  ❌ Attempt ${attempt} failed: ${message}`);
      
      if (attempt < maxRetries) {
        const waitTime = 100 * Math.pow(2, attempt - 1);
        console.log(`  ⏳ Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError;
}

// Your existing email functions remain the same
// Just replace transporter.sendMail() calls with sendEmailWithRetry()
```

### 6️⃣ Test It (1 min)

Push your changes:
```bash
git add .
git commit -m "Switch to SendGrid email service"
git push
```

Wait 2-3 minutes for Render to deploy.

Then test:
```
https://your-app.onrender.com/api/health/email
```

Should show:
```json
{
  "emailConfigured": true,
  "message": "✅ Email service is healthy"
}
```

### 7️⃣ Do a Test Registration (1 min)

1. Go to your hackathon site
2. Complete registration
3. **Check email in 30 seconds** (much faster than Gmail!)
4. Confirmation should arrive

---

## Before & After

### Before (Gmail - Timeout)
```
❌ Failed to send registration initiated email: Error: Connection timeout
code: 'ETIMEDOUT'
```

### After (SendGrid - Success)
```
✅ Registration initiated email sent to user@example.com
📬 Email response ID: <uuid>
```

---

## If Something Goes Wrong

### "Invalid API Key" Error?
- Check SENDGRID_API_KEY is copied exactly (no spaces)
- Regenerate key from SendGrid dashboard if unsure

### "Email provider not configured"?
- Make sure you added EMAIL_PROVIDER=sendgrid to Render
- Check config.ts uses correct variable names

### Still not sending?
- Visit `/api/health/email` endpoint to see exact error
- Check Render logs for more details
- Verify email address is correct

---

## Cost

✅ **FREE** - SendGrid free tier includes:
- 100 emails per day
- Full API access
- Excellent for testing and small deployments
- Upgrade anytime if you need more

---

## Done! ✨

Once this is working, you won't have timeout issues anymore. SendGrid is enterprise-grade and built for cloud deployment.

**Time saved:** No more debugging timeout issues!  
**Reliability:** 99.99% delivery rate  
**Support:** Excellent documentation
