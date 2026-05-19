import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/errors';
import { IUserPayload, UserRole } from '../types';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Access denied. No token provided.');
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'super_secret_jwt_sign_key_for_smart_leads_dashboard_2026';

    const decoded = jwt.verify(token, secret) as IUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, 'Token expired. Please login again.'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, 'Invalid token. Authorization failed.'));
    }
    next(error);
  }
};

export const authorize = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized. Please login.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`));
    }

    next();
  };
};
