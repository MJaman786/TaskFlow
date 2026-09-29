// ─── Authentication Controllers ─────────────────────────────────────────
// Handles HTTP request lifecycle, cookies, and responses for Auth endpoints.

import asyncHandler from '../../common/asyncHandler.js';
import { sendSuccess } from '../../common/response.js';
import authService from './auth.service.js';

// Helper to extract device and client metadata for session logging
const getClientMeta = (req) => ({
    ip: req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown',
    userAgent: req.headers['user-agent'] || 'Unknown Platform Device',
});

// Cookie options for secure HttpOnly session storage
const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

// POST /api/v1/auth/register
export const register = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;
    const user = await authService.register({ name, email, password, role });

    return sendSuccess(res, {
        statusCode: 201,
        message: 'Account registered successfully. A 6-digit verification code has been dispatched to your email.',
        data: { user },
    });
});

// POST /api/v1/auth/resend-verification
export const resendVerification = asyncHandler(async (req, res) => {
    await authService.resendVerificationOtp(req.body.email);
    return sendSuccess(res, {
        message: 'If an unverified account matches that address, a new verification code has been dispatched.',
        data: null,
    });
});

// POST /api/v1/auth/verify-email
export const verifyEmail = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;
    const result = await authService.verifyEmailOtp({ email, otp });
    return sendSuccess(res, {
        message: 'Email verified successfully. You can now log in to TaskFlow.',
        data: result,
    });
});

// POST /api/v1/auth/login
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { ip, userAgent } = getClientMeta(req);

    const result = await authService.login({ email, password, ip, userAgent });

    // Set refresh token in secure HTTP-only cookie
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

    return sendSuccess(res, {
        message: 'Login successful.',
        data: {
            accessToken: result.accessToken,
            user: result.user,
        },
    });
});

// POST /api/v1/auth/refresh
export const refresh = asyncHandler(async (req, res) => {
    // Check both cookie and body for token
    const token = req.cookies?.refreshToken || req.body?.refreshToken;
    const { ip, userAgent } = getClientMeta(req);

    const result = await authService.refreshAccessToken({ refreshToken: token, ip, userAgent });

    // Rotate refresh token cookie
    res.cookie('refreshToken', result.refreshToken, COOKIE_OPTIONS);

    return sendSuccess(res, {
        message: 'Session token rotated successfully.',
        data: { accessToken: result.accessToken },
    });
});

// POST /api/v1/auth/logout
export const logout = asyncHandler(async (req, res) => {
    await authService.logout(req.user.id, req.user.sessionId);
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    return sendSuccess(res, {
        message: 'Logged out successfully.',
        data: null,
    });
});

// GET /api/v1/auth/me
export const getMe = asyncHandler(async (req, res) => {
    const user = await authService.getMe(req.user.id);
    return sendSuccess(res, {
        message: 'Authenticated identity context retrieved.',
        data: { user },
    });
});

// POST /api/v1/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
    await authService.forgotPassword(req.body.email);
    return sendSuccess(res, {
        message: 'If an account matches that email address, password recovery instructions have been dispatched.',
        data: null,
    });
});

// POST /api/v1/auth/reset-password
export const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, password } = req.body;
    const result = await authService.resetPassword({ email, otp, password });
    return sendSuccess(res, {
        message: 'Password reset successfully. You can now log in with your new credentials.',
        data: result,
    });
});

// PATCH /api/v1/auth/change-password
export const changePassword = asyncHandler(async (req, res) => {
    await authService.changePassword(req.user.id, req.body);
    res.clearCookie('refreshToken', COOKIE_OPTIONS);
    return sendSuccess(res, {
        message: 'Password changed successfully. All other active sessions have been terminated.',
        data: null,
    });
});

// PATCH /api/v1/auth/profile
export const updateProfile = asyncHandler(async (req, res) => {
    const user = await authService.updateProfile(req.user.id, req.body);
    return sendSuccess(res, {
        message: 'Profile updated successfully.',
        data: { user },
    });
});