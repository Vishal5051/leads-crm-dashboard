import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { registerValidator, loginValidator } from '../middleware/validator';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);

// Protected routes
router.get('/me', authenticate, getMe);

export default router;
