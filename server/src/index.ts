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

import { config } from './config/index.js';
import { errorHandler } from './middleware/error.js';

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

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // stricter limit for registration and payment
  skip: (req) => req.method === 'OPTIONS', // Skip rate limiting for CORS preflight
});

app.use('/api/', limiter);
app.use('/api/teams', strictLimiter);
app.use('/api/payments', strictLimiter);

// Routes
app.use('/api/health', healthRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/admin/auth', adminAuthRouter);
app.use('/api/admin/teams', adminTeamsRouter);
app.use('/api/admin/search', adminSearchRouter);
app.use('/api/admin/export', adminExportRouter);

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

export async function startServer(): Promise<void> {
  try {
    // Log MongoDB URI (without password)
    const uriDisplay = config.mongodbUri.replace(/:[^@]+@/, ':***@');
    console.log(`📦 MongoDB URI: ${uriDisplay}`);

    // Connect to MongoDB with timeout
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(config.mongodbUri, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      socketTimeoutMS: 10000,
      connectTimeoutMS: 10000,
    });
    console.log('✓ Connected to MongoDB');

    // Start server
    app.listen(config.port, () => {
      console.log(`✓ Server running on http://localhost:${config.port}`);
      console.log(`✓ Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('✗ Failed to start server:', error);
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      if (error.message.includes('authentication') || error.message.includes('auth')) {
        console.error('⚠️  MONGODB ERROR: Check your username/password');
      } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
        console.error('⚠️  DNS ERROR: Cannot resolve MongoDB hostname');
      } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        console.error('⚠️  TIMEOUT ERROR: Check MongoDB Atlas IP whitelist (add 0.0.0.0/0)');
      } else if (error.message.includes('connect')) {
        console.error('⚠️  CONNECTION ERROR: Check MongoDB Atlas network access settings');
      }
    } else {
      console.error('Unknown error type:', typeof error, error);
    }
    process.exit(1);
  }
}

export default app;

// Start server if this is the main module
if (import.meta.url.endsWith(process.argv[1]) || process.argv[1]?.includes('index.ts')) {
  console.log('[STARTUP] Calling startServer()...');
  startServer().catch(err => {
    console.error('[STARTUP] startServer failed:', err);
    process.exit(1);
  });
}
