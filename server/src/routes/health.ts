import { Router, Response } from 'express';

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

export default router;
