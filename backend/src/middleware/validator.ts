import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { ApiError } from '../utils/errors';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsg = errors.array().map(err => err.msg).join('; ');
    throw new ApiError(400, errorMsg);
  }
  next();
};

export const registerValidator = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('role').optional().isIn(['Admin', 'Sales User']).withMessage('Role must be either Admin or Sales User'),
  handleValidationErrors,
];

export const loginValidator = [
  body('email').trim().isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

export const leadValidator = [
  body('name').trim().notEmpty().withMessage('Lead name is required'),
  body('email').trim().isEmail().withMessage('Please provide a valid lead email address'),
  body('status').isIn(['New', 'Contacted', 'Qualified', 'Lost']).withMessage('Invalid lead status'),
  body('source').isIn(['Website', 'Instagram', 'Referral']).withMessage('Invalid lead source'),
  handleValidationErrors,
];
