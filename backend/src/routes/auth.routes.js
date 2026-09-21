import { Router } from 'express';
import { register, login, me } from '../controllers/auth.controller.js';
import { loginLimiter, registerLimiter } from '../middleware/rateLimiter.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/register', registerLimiter, validate(registerSchema), register);


router.get('/me', protect, me);

export default router;
