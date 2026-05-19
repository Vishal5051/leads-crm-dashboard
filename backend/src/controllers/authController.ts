import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { ApiError } from '../utils/errors';

const generateToken = (payload: { id: string; email: string; role: string; name: string }): string => {
  const secret = process.env.JWT_SECRET || 'super_secret_jwt_sign_key_for_smart_leads_dashboard_2026';
  const expires = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign(payload, secret, { expiresIn: expires as any });
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, 'User with this email address already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'Sales User',
    });

    const tokenPayload = {
      id: newUser._id.toString(),
      email: newUser.email,
      role: newUser.role,
      name: newUser.name,
    };

    const token = generateToken(tokenPayload);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    // Verify password match
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const tokenPayload = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const token = generateToken(tokenPayload);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.user) {
      throw new ApiError(401, 'Unauthorized');
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    res.status(200).json({
      success: true,
      message: 'User profile retrieved successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
