// Immediate startup logging
console.log('[STARTUP] Index.ts being executed...');

import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';

// FIX #2: Disable Mongoose query buffering (fail fast, don't hang)
mongoose.set('bufferCommands', false);

import { config } from './config/index.js';
import { errorHandler } from './middleware/error.js';
import { combineMiddleware } from './middleware/auth.js';

import teamsRouter from './routes/teams.js';
import paymentsRouter from './routes/payments.js';
import adminAuthRouter from './routes/admin.js';
import adminTeamsRouter from './routes/admin-teams.js';
import adminSearchRouter from './routes/admin-search.js';
import adminExportRouter from './routes/admin-export.js';
import healthRouter from './routes/health.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app: Express = express();

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Rate limiting - exclude health check endpoints from rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  skip: (req) => /^\/api\/health/.test(req.path), // Skip rate limiting for all health check endpoints (returns boolean)
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Allow more concurrent registrations from same IP (e.g., college campus)
  skip: (req) => req.method === 'OPTIONS', // Skip rate limiting for CORS preflight
});

app.use('/api/', limiter);
app.use('/api/teams', strictLimiter);
app.use('/api/payments', strictLimiter);

// ✅ CHECKLIST: Root health check endpoint - no auth, no rate limit, minimal logic
app.get('/', (_req, res) => {
  res.status(200).json({ status: 'App is running' });
});

// Routes
app.use('/api/health', healthRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/admin/auth', adminAuthRouter);
app.use('/api/admin/teams', combineMiddleware, adminTeamsRouter);
app.use('/api/admin/search', combineMiddleware, adminSearchRouter);
app.use('/api/admin/export', combineMiddleware, adminExportRouter);

// Serve static files from client build in production
if (config.nodeEnv === 'production') {
  const clientBuildPath = path.join(__dirname, '../../client/dist');
  console.log(`📁 Serving static files from: ${clientBuildPath}`);
  
  app.use(express.static(clientBuildPath));
  
  // Handle React Router - send all non-API requests to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Error handling
app.use(errorHandler);

// FIX #1: Connect MongoDB BEFORE starting server (critical for production safety)
async function connectDatabase(): Promise<void> {
  try {
    // Check if already connected
    if (mongoose.connection.readyState === 1) {
      console.log('✓ MongoDB already connected');
      return;
    }

    // Log MongoDB URI (without password)
    const uriDisplay = config.mongodbUri.replace(/:[^@]+@/, ':***@');
    console.log(`📦 MongoDB URI: ${uriDisplay}`);

    console.log('⏳ Connecting to MongoDB...');
    
    // FIX #3: Set proper timeouts for reliability
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 5000,  // Fail fast if DB not available
      socketTimeoutMS: 45000,
      connectTimeoutMS: 5000,
      maxPoolSize: 50,
      minPoolSize: 5,
      maxIdleTimeMS: 60000,
    });
    
    console.log('✅ MongoDB connected successfully');
    console.log(`📊 Connection state: ${mongoose.connection.readyState}`);
  } catch (error) {
    console.error('❌ CRITICAL ERROR: Failed to connect to MongoDB');
    if (error instanceof Error) {
      console.error('Error:', error.message);
      
      if (error.message.includes('authentication') || error.message.includes('auth')) {
        console.error('💡 Fix: Check MongoDB username/password');
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
        console.error('💡 Fix: Check MongoDB host URL');
      } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        console.error('💡 Fix: MongoDB not responding. Check Atlas status and IP whitelist');
      } else if (error.message.includes('connect')) {
        console.error('💡 Fix: Check MongoDB Atlas network access settings');
      }
    }
    
    // ✅ CHECKLIST: Log error but DON'T block startup - server can start without DB
    // This allows health check endpoints to function for monitoring
    // (some database-dependent features will fail gracefully)
    console.error('⚠️  DB connection failed - server starting in degraded mode');
    console.error('    Some features requiring database access will fail.');
  }
}

export async function startServer(): Promise<void> {
  try {
    // ✅ CHECKLIST: Connect to MongoDB asynchronously - don't block startup
    // This allows the health check endpoint to work even if DB is temporarily down
    console.log('Starting server initialization...');
    connectDatabase().catch(err => {
      // Error already logged in connectDatabase()
    });

    // Start the Express server immediately - don't wait for DB
    const server = app.listen(config.port, () => {
      console.log(`\n✅ Server running on http://localhost:${config.port}`);
      console.log(`✅ Environment: ${config.nodeEnv}`);
    });

    // Log email configuration status
    console.log('\n📧 EMAIL CONFIGURATION:');
    if (config.email.user && config.email.pass) {
      console.log(`  ✓ Email user: ${config.email.user}`);
      console.log(`  ✓ Email password: ${config.email.pass.length} characters`);
    } else {
      console.error('  ✗ CRITICAL: Email user or password not configured!');
      console.error('  Email will NOT be sent. Set EMAIL_USER and EMAIL_PASS environment variables.');
    }
    console.log('  💡 Check /api/health/email endpoint for detailed email diagnostics\n');

    // Graceful shutdown handlers
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, closing server gracefully...');
      server.close(() => {
        console.log('Server closed');
        mongoose.connection.close();
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, closing server gracefully...');
      server.close(() => {
        console.log('Server closed');
        mongoose.connection.close();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

export default app;

// Start server if this is the main module
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('index.ts')) {
  console.log('[STARTUP] Calling startServer()...');
  startServer().catch(err => {
    console.error('[STARTUP] startServer failed:', err);
  });
}
