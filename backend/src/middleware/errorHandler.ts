import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const message = err.message || 'Internal Server Error';

  // Log error details to server console
  console.error(`[API Error] ${req.method} ${req.path} - Status: ${statusCode} - Message: ${message}`);
  
  if (statusCode === 500) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
