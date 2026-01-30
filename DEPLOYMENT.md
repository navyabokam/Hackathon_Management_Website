# Deployment Guide

## Prerequisites

- Git
- Node.js 20+
- MongoDB Atlas account (https://www.mongodb.com/cloud/atlas)
- GitHub account (for CI/CD)
- Hosting service (Vercel, Netlify, Railway, Heroku, etc.)

## Development Setup with Docker

For a fully containerized development environment:

```bash
# Start MongoDB, MailHog, and Mongo Express
docker-compose up -d

# Environment will include:
# - MongoDB: localhost:27017 (admin/password)
# - MailHog: http://localhost:8025 (email UI)
# - Mongo Express: http://localhost:8081 (database UI)

# Update server/.env
MONGODB_URI=mongodb://admin:password@localhost:27017/hackathon
SMTP_HOST=mailhog
SMTP_PORT=1025

# Run seed
npm run seed

# Start servers normally
npm run dev  # in server/
npm run dev  # in client/
```

## Production Deployment

### Option 1: Vercel + Railway

**Best for**: Quick, zero-config deployment

#### Frontend (Vercel)

1. Push code to GitHub
2. Connect repo to Vercel: https://vercel.com/new
3. Configure build:
   - Framework Preset: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables:
   ```
   VITE_API_URL=https://api.your-domain.com
   ```
5. Deploy

#### Backend (Railway)

1. Push code to GitHub
2. Connect to Railway: https://railway.app/new
3. Create service from GitHub repo
4. Configure environment variables:
   ```
   MONGODB_URI=<MongoDB Atlas connection string>
   JWT_SECRET=<generate long random string>
   CLIENT_ORIGIN=https://your-frontend.vercel.app
   NODE_ENV=production
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=<app-specific-password>
   ```
5. Set root directory to `server/`
6. Deploy

### Option 2: Heroku (Classic Stack)

**Note**: Heroku will deprecate free tier. Use Railway, Render, or Fly.io instead.

#### Backend

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set JWT_SECRET=your-secret
heroku config:set MONGODB_URI=your-atlas-uri
heroku config:set CLIENT_ORIGIN=https://your-frontend.app

# Deploy
git push heroku main:main

# View logs
heroku logs --tail
```

### Option 3: Docker + AWS ECS/DigitalOcean/Google Cloud

#### Build Docker Images

**Backend Dockerfile**:
```dockerfile
FROM node:20-alpine as builder
WORKDIR /app
COPY server/package*.json ./
RUN npm ci
COPY server .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 4000
CMD ["npm", "start"]
```

**Frontend Dockerfile**:
```dockerfile
FROM node:20-alpine as builder
WORKDIR /app
COPY client/package*.json ./
RUN npm ci
COPY client .
RUN npm run build

FROM nginx:alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY <<EOF /etc/nginx/conf.d/default.conf
server {
  listen 80;
  location / {
    root /usr/share/nginx/html;
    try_files $uri $uri/ /index.html;
  }
  location /api {
    proxy_pass http://backend:4000;
  }
}
EOF
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build & Push to Docker Hub**:
```bash
docker build -f server/Dockerfile -t yourusername/hackathon-server:latest ./server
docker build -f client/Dockerfile -t yourusername/hackathon-client:latest ./client

docker push yourusername/hackathon-server:latest
docker push yourusername/hackathon-client:latest
```

## Database Setup (MongoDB Atlas)

1. Create account: https://www.mongodb.com/cloud/atlas
2. Create free cluster (M0)
3. Create database user:
   - Username: `hackathon_app`
   - Password: Generate strong password
4. Whitelist IP address (or allow all: 0.0.0.0/0 for dev)
5. Get connection string:
   ```
   mongodb+srv://hackathon_app:password@cluster.mongodb.net/hackathon?retryWrites=true&w=majority
   ```
6. Use as `MONGODB_URI` in environment

## Email Service Setup

### Option 1: Gmail + App Passwords

1. Enable 2-factor authentication: https://myaccount.google.com/security
2. Generate app password: https://myaccount.google.com/apppasswords
3. Use in `.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=<16-char-app-password>
   ```

### Option 2: SendGrid

1. Create account: https://sendgrid.com/
2. Get API key
3. Use with nodemailer-sendgrid adapter

### Option 3: AWS SES

1. Request production access: https://console.aws.amazon.com/sesv2/
2. Verify sender email
3. Get access keys
4. Configure in application

## Continuous Integration/Deployment

### GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 20

      - name: Install server dependencies
        working-directory: ./server
        run: npm ci

      - name: Lint server
        working-directory: ./server
        run: npm run lint

      - name: Test server
        working-directory: ./server
        run: npm run test

      - name: Install client dependencies
        working-directory: ./client
        run: npm ci

      - name: Lint client
        working-directory: ./client
        run: npm run lint

      - name: Build client
        working-directory: ./client
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: vercel/action@main
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: client

      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
          RAILWAY_PROJECT_ID: ${{ secrets.RAILWAY_PROJECT_ID }}
```

## SSL/HTTPS Setup

### Using Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d your-domain.com

# Update Nginx/HAProxy to use certificates
ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

# Auto-renew
sudo certbot renew --dry-run
```

## Monitoring & Logging

### Application Performance Monitoring (APM)

**Sentry** (Error Tracking):
```bash
npm install @sentry/node

# In server/src/index.ts
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: config.nodeEnv,
});
```

**LogRocket** (Frontend Session Replay):
```bash
npm install logrocket

# In client/src/App.tsx
import LogRocket from 'logrocket';
LogRocket.init('app-id');
```

### Log Aggregation

**Using Datadog**:
```bash
npm install @datadog/browser-rum

# Configure in client and server to send logs to Datadog
```

## Backup Strategy

### MongoDB Backup

**Automated Backups (MongoDB Atlas)**:
- Default: Daily backups retained for 35 days
- Enable point-in-time restore (Pro tier)

**Manual Backup**:
```bash
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/hackathon" --out=./backup

# Restore
mongorestore --uri="mongodb+srv://user:pass@cluster.mongodb.net/hackathon" ./backup
```

## Security Checklist

- [ ] Change all default passwords and secrets
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS to specific origin only
- [ ] Set secure cookies: `secure: true, httpOnly: true, sameSite: 'strict'`
- [ ] Enable rate limiting on all endpoints
- [ ] Use environment variables for all secrets
- [ ] Set up Web Application Firewall (WAF)
- [ ] Enable DDoS protection
- [ ] Regular security audits: `npm audit`
- [ ] Rotate JWT secret periodically
- [ ] Monitor failed login attempts
- [ ] Set up alerts for error spikes

## Performance Optimization

### CDN Configuration

Use CloudFlare or AWS CloudFront for:
- Frontend static assets (JS, CSS, images)
- API endpoint caching (with appropriate TTL)

### Database Query Optimization

```typescript
// Add indexes for common queries
Team.collection.createIndex({ "leaderEmail": 1 });
Team.collection.createIndex({ "collegeName": 1, "createdAt": -1 });

// Use projection to fetch only needed fields
Team.findOne({ registrationId }, { password: 0, __v: 0 });
```

### Caching Strategy

```typescript
// Cache in Redis
const redis = require('redis').createClient();
const cachedTeam = await redis.get(`team:${registrationId}`);
if (!cachedTeam) {
  const team = await Team.findOne({ registrationId });
  await redis.setex(`team:${registrationId}`, 3600, JSON.stringify(team));
}
```

## Rollback Procedure

```bash
# If deployment fails:
heroku rollback  # Heroku
gh deployment rollback --environment production  # GitHub

# Manual rollback (Docker):
docker pull yourusername/hackathon-server:previous
docker run -d -p 4000:4000 yourusername/hackathon-server:previous
```

## Maintenance

### Regular Tasks

- [ ] Review error logs weekly
- [ ] Update dependencies monthly: `npm update`
- [ ] Security audit quarterly: `npm audit`
- [ ] Database optimization monthly
- [ ] SSL certificate renewal (auto with Let's Encrypt)
- [ ] Clean up old payment records (archive)
- [ ] Review and update security headers

### Scaling

When handling more traffic:

1. **Horizontal Scaling**: Deploy multiple instances behind load balancer
2. **Database Optimization**: Add indexes, shard if necessary
3. **Caching**: Implement Redis for session storage
4. **CDN**: Cache static assets and API responses
5. **Microservices**: Split into separate services (payments, emails, etc.)

## Support Resources

- **Deployment Issues**: Check host provider's documentation
- **Database Issues**: MongoDB Atlas support
- **Email Issues**: Gmail/SendGrid/AWS SES documentation
- **Monitoring**: Sentry, Datadog, New Relic docs
- **Performance**: Use Chrome DevTools, Lighthouse

---

**Successfully Deployed! 🚀** Monitor your application regularly and update dependencies to maintain security and performance.
