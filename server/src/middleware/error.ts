import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error(error);

  res.status(500).json({
    error: error.message || 'Internal server error',
  });
}
