import { Router, Response } from 'express';
import { LoginSchema } from '../schemas/index.js';
import * as authService from '../services/auth.service.js';
import { AuthRequest, authMiddleware, secretKeyMiddleware } from '../middleware/auth.js';

const router = Router();

// POST /api/admin/auth/login - Requires secret key
router.post('/login', secretKeyMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const input = LoginSchema.parse(req.body);
    const token = await authService.loginAdmin(input.email, input.password);
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// POST /api/admin/auth/logout
router.post('/logout', authMiddleware, async (_req: AuthRequest, res: Response) => {
  res.clearCookie('authToken');
  res.json({ message: 'Logged out successfully' });
});

export default router;
