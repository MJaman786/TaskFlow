// ─── Authentication Route Pipeline ──────────────────────────────────────
// Mounts public and protected endpoints with input validation and auth checks.

import { Router } from 'express';
import * as authController from './auth.controller.js';
import protect from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import {
    registerSchema,
    loginSchema,
    verifyEmailSchema,
    resendVerificationSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    changePasswordSchema,
    updateProfileSchema,
} from './auth.validation.js';

const router = Router();

// ─── Public Endpoints ───────────────────────────────────────────────────
// 1. Register a new user
router.post('/register', validate(registerSchema), authController.register);

// 2. Resend verification code
router.post('/resend-verification', validate(resendVerificationSchema), authController.resendVerification);

// 3. Verify email with 6-digit OTP
router.post('/verify-email', validate(verifyEmailSchema), authController.verifyEmail);

// 4. Log in (issues access token + refresh token cookie)
router.post('/login', validate(loginSchema), authController.login);

// 5. Rotate session access token using refresh token
router.post('/refresh', authController.refresh);

// 6. Request password reset recovery code
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);

// 7. Reset password using recovery code
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);

// ─── Protected Endpoints (Requires valid Bearer JWT) ─────────────────────
// 8. Fetch current authenticated user context
router.get('/me', protect, authController.getMe);

// 9. Update authenticated user profile details
router.patch('/profile', protect, validate(updateProfileSchema), authController.updateProfile);

// 10. Change password (terminates all other active sessions)
router.patch('/change-password', protect, validate(changePasswordSchema), authController.changePassword);

// 11. Log out current active session
router.post('/logout', protect, authController.logout);

export default router;