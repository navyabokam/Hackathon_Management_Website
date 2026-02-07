import { Router, Response } from 'express';
import nodemailer from 'nodemailer';
import mongoose from 'mongoose';
import { config } from '../config/index.js';
import { Team } from '../models/index.js';

const router = Router();

// GET /api/health - Health check
router.get('/', (_req, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
  });
});

// GET /api/health/email - Email configuration diagnostics (with timeout for fast response)
router.get('/email', async (_req, res: Response) => {
  const diagnostics: any = {
    emailConfigured: false,
    smtpConnection: false,
    emailUser: config.email.user,
    emailPassLength: config.email.pass?.length || 0,
    errors: [],
  };

  // Check basic configuration
  if (!config.email.user || !config.email.pass) {
    diagnostics.errors.push('✗ Email user or password not configured');
  }

  // Try to verify SMTP connection with timeout (max 5 seconds)
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    });

    // Use Promise.race to enforce timeout - respond quickly even if SMTP is slow
    await Promise.race([
      transporter.verify(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('SMTP verification timeout (>5s)')), 5000)
      ),
    ]);
    diagnostics.smtpConnection = true;
    diagnostics.message = '✅ Email service is healthy';
  } catch (error) {
    diagnostics.errors.push('✗ SMTP connection failed');
    diagnostics.errors.push(`Error: ${error instanceof Error ? error.message : String(error)}`);
    diagnostics.message = '❌ Email service is NOT healthy';
  }

  diagnostics.emailConfigured = diagnostics.errors.length === 0 && diagnostics.smtpConnection;

  res.status(diagnostics.emailConfigured ? 200 : 400).json(diagnostics);
});

// GET /api/health/db - Database diagnostics (with timeout for fast response)
router.get('/db', async (_req, res: Response) => {
  const diagnostics: any = {
    mongoConnected: false,
    mongoUri: config.mongodbUri ? '✓ Set' : '✗ Not set',
    connectionState: mongoose.connection.readyState,
    teamCollectionExists: false,
    teamCount: 0,
    errors: [],
  };

  // Check MongoDB URI
  if (!config.mongodbUri) {
    diagnostics.errors.push('✗ MONGODB_URI environment variable not set');
  }

  // Check connection state
  const states: any = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  diagnostics.connectionStatus = states[mongoose.connection.readyState] || 'unknown';

  try {
    // Try to count teams in database with timeout (max 5 seconds)
    await Promise.race([
      Team.countDocuments().then(count => {
        diagnostics.teamCollectionExists = true;
        diagnostics.teamCount = count;
        diagnostics.message = `✅ Database is healthy (${count} teams found)`;
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Database query timeout (>5s)')), 5000)
      ),
    ]);
  } catch (error) {
    diagnostics.errors.push('✗ Cannot read from database');
    diagnostics.errors.push(`Error: ${error instanceof Error ? error.message : String(error)}`);
    diagnostics.message = '❌ Database connection or query failed';
  }

  res.status(diagnostics.errors.length === 0 ? 200 : 400).json(diagnostics);
});

export default router;
