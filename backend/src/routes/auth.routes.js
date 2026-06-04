import { Router } from 'express';
import { body } from 'express-validator';
import { login, refresh, register, registerRules, requestPasswordReset, resetPassword, verifyEmail } from '../controllers/auth.controller.js';
import { validate } from '../middlewares/validate.js';

const router = Router();

router.post('/register', registerRules, validate, register);
router.post('/login', body('email').isEmail().normalizeEmail(), body('password').exists(), validate, login);
router.post('/refresh-token', refresh);
router.post('/verify-email', body('token').notEmpty(), validate, verifyEmail);
router.post('/password-reset/request', body('email').isEmail().normalizeEmail(), validate, requestPasswordReset);
router.post('/password-reset/confirm', body('token').notEmpty(), body('password').isLength({ min: 8 }), validate, resetPassword);

export default router;
