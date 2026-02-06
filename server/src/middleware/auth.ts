import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../services/index.js';

export interface AuthRequest extends Request {
  user?: { id: string; email: string };
}

// Secret key for admin routes
const ADMIN_SECRET_KEY = 'forgeascend-9XK';

export async function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.cookies.authToken || req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const user = await verifyToken(token);
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

export function secretKeyMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    // Accept secret key from query parameter, header, or authorization header
    const secretKey =
      (req.query.secretKey as string) ||
      (req.headers['x-secret-key'] as string) ||
      (req.headers.authorization?.split(' ')[0] === 'Bearer' ? undefined : req.headers.authorization);

    if (!secretKey || secretKey !== ADMIN_SECRET_KEY) {
      res.status(401).json({ error: 'Invalid or missing secret key' });
      return;
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

export function combineMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  // For admin routes, only require secret key authentication
  // JWT token is only needed for admin login endpoint
  secretKeyMiddleware(req, res, next);
}