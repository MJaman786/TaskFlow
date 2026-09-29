// ─── Authentication Service Layer ───────────────────────────────────────
// Encapsulates core identity logic: hashing, JWTs, OTPs, and mail delivery.

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserModel } from './user.model.js';
import { OtpModel } from './otp.model.js';
import { SessionModel } from './session.model.js';
import AppError from '../../common/AppError.js';
import envConfig from '../../config/env.config.js';
import {
    generateAccessToken,
    generateRefreshToken,
    generateOtp,
    hashItem,
} from '../../utils/generators.utils.js';
import { sendEmail } from '../../shared/mail.js';

// Email HTML templates from Module 2
import emailVerificationTemplate from '../../templates/auth/emailVerification.template.js';
import passwordResetTemplate from '../../templates/auth/passwordReset.template.js';
import passwordChangedTemplate from '../../templates/auth/passwordChanged.template.js';
import welcomeTemplate from '../../templates/user/welcome.template.js';

const BCRYPT_SALT_ROUNDS = 10;

/**
 * 1. Register a new user
 * Handles new account creation, unverified re-registrations, and OTP emails.
 */
export const register = async ({ name, email, password, role = 'USER' }) => {
    let user = await UserModel.findByEmail(email);

    // If account exists and is already verified, block registration
    if (user && user.is_email_verified) {
        throw new AppError('An account with this email address is already registered.', 409);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    if (user && !user.is_email_verified) {
        // Overwrite unverified account details cleanly
        user = await UserModel.updateUnverifiedUser({
            id: user.id,
            name,
            password: hashedPassword,
            role,
        });
    } else {
        // Create new user in PostgreSQL
        user = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
    }

    // Clear any previous verification OTPs for this user
    await OtpModel.clearExisting(user.id, 'EMAIL_VERIFICATION');

    // Generate fresh 6-digit OTP code (valid for 10 minutes)
    const { otp, otpExpiry } = generateOtp(10);
    const otpHash = hashItem(otp);

    await OtpModel.create({
        userId: user.id,
        type: 'EMAIL_VERIFICATION',
        otpHash,
        expiresAt: otpExpiry,
    });

    // Send verification email (non-blocking error handle)
    try {
        const html = emailVerificationTemplate({ name: user.name, otp, expiryMinutes: 10 });
        await sendEmail({
            to: user.email,
            subject: 'Verify your TaskFlow account',
            html,
        });
    } catch (err) {
        console.error('Email delivery error during registration:', err.message);
    }

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.is_email_verified,
    };
};

/**
 * 2. Resend email verification OTP code
 */
export const resendVerificationOtp = async (email) => {
    const user = await UserModel.findByEmail(email);
    if (!user) return; // Silent return for security

    if (user.is_email_verified) {
        throw new AppError('This email address has already been verified. Please log in.', 400);
    }

    // Rate-limit: Ensure user waits at least 60 seconds between resend requests
    const isRateLimited = await OtpModel.hasRecentOtp(user.id, 'EMAIL_VERIFICATION');
    if (isRateLimited) {
        throw new AppError('Please wait 60 seconds before requesting another verification code.', 429);
    }

    await OtpModel.clearExisting(user.id, 'EMAIL_VERIFICATION');

    const { otp, otpExpiry } = generateOtp(10);
    await OtpModel.create({
        userId: user.id,
        type: 'EMAIL_VERIFICATION',
        otpHash: hashItem(otp),
        expiresAt: otpExpiry,
    });

    try {
        const html = emailVerificationTemplate({ name: user.name, otp, expiryMinutes: 10 });
        await sendEmail({
            to: user.email,
            subject: 'Your new verification code',
            html,
        });
    } catch (err) {
        console.error('Email delivery error during resend-otp:', err.message);
    }
};

/**
 * 3. Verify Email Address using 6-digit OTP code
 */
export const verifyEmailOtp = async ({ email, otp }) => {
    const user = await UserModel.findByEmail(email);
    if (!user) throw new AppError('Account not found.', 404);

    if (user.is_email_verified) {
        throw new AppError('This email is already verified. You can log in.', 400);
    }

    // Fetch active OTP record
    const otpRecord = await OtpModel.findActive(user.id, 'EMAIL_VERIFICATION');
    if (!otpRecord) {
        throw new AppError('Invalid or expired verification code. Please request a new code.', 400);
    }

    // Check maximum failed attempts threshold
    if (otpRecord.attempts >= 5) {
        throw new AppError('Too many failed attempts. Please request a new verification code.', 429);
    }

    const hashedInputOtp = hashItem(otp);
    if (otpRecord.otp_hash !== hashedInputOtp) {
        await OtpModel.incrementAttempts(otpRecord.id);
        throw new AppError('Invalid verification code.', 400);
    }

    // Mark OTP as used and update user status
    await OtpModel.markUsed(otpRecord.id);
    await UserModel.markEmailVerified(user.id);

    // Send onboarding welcome email
    try {
        const html = welcomeTemplate({ name: user.name });
        await sendEmail({ to: user.email, subject: 'Welcome to TaskFlow! 🎉', html });
    } catch (err) {
        console.error('Error sending welcome email:', err.message);
    }

    return { email: user.email, isEmailVerified: true };
};

/**
 * 4. User Login
 * Validates credentials, checks account status, and initiates an active session.
 */
export const login = async ({ email, password, ip, userAgent }) => {
    const user = await UserModel.findByEmail(email, true); // true selects password hash
    if (!user) {
        throw new AppError('Invalid email or password.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid email or password.', 401);
    }

    if (!user.is_email_verified) {
        throw new AppError('Please verify your email address before logging in.', 403);
    }

    if (user.status === 'SUSPENDED') {
        throw new AppError('Your account has been suspended. Please contact platform administration.', 403);
    }

    // 1. Create a session in PostgreSQL
    const session = await SessionModel.create({
        userId: user.id,
        refreshTokenHash: 'INITIALIZING',
        ip,
        userAgent,
    });

    // 2. Generate Access and Refresh JWTs
    const tokenPayload = {
        id: user.id,
        email: user.email,
        role: user.role,
        sessionId: session.id,
    };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // 3. Store hashed refresh token in session
    await SessionModel.rotateToken(session.id, hashItem(refreshToken), ip, userAgent);

    // 4. Update last_login timestamp
    await UserModel.updateLastLogin(user.id);

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status,
            avatar: user.avatar,
            isEmailVerified: user.is_email_verified,
            lastLogin: new Date(),
        },
    };
};

/**
 * 5. Refresh Access Token (Token Rotation)
 */
export const refreshAccessToken = async ({ refreshToken, ip, userAgent }) => {
    if (!refreshToken) {
        throw new AppError('Refresh token is required.', 401);
    }

    let decoded;
    try {
        decoded = jwt.verify(refreshToken, envConfig.jwt.refreshSecret);
    } catch {
        throw new AppError('Invalid or expired refresh token. Please log in again.', 401);
    }

    const session = await SessionModel.findById(decoded.sessionId);

    // Security check: Detect revoked or missing sessions
    if (!session || session.revoked) {
        if (session) {
            await SessionModel.revokeAllForUser(decoded.id);
        }
        throw new AppError('Session expired or invalidated. Please log in again.', 401);
    }

    // Security check: Detect token reuse / hijacked credentials
    const incomingHash = hashItem(refreshToken);
    if (session.refresh_token_hash !== incomingHash) {
        await SessionModel.revokeAllForUser(decoded.id);
        throw new AppError('Security violation: token reuse detected. All sessions revoked.', 401);
    }

    // Issue rotated tokens
    const tokenPayload = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        sessionId: session.id,
    };
    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    // Update session record with rotated token hash
    await SessionModel.rotateToken(session.id, hashItem(newRefreshToken), ip, userAgent);

    return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
    };
};

/**
 * 6. Logout
 * Revokes the specific active session in the database.
 */
export const logout = async (userId, sessionId) => {
    if (sessionId) {
        await SessionModel.revokeById(sessionId, userId);
    }
};

/**
 * 7. Get Authenticated User Identity Context
 */
export const getMe = async (userId) => {
    const user = await UserModel.findById(userId);
    if (!user) throw new AppError('User profile not found.', 404);
    return user;
};

/**
 * 8. Forgot Password
 * Dispatches 6-digit password recovery code to email.
 */
export const forgotPassword = async (email) => {
    const user = await UserModel.findByEmail(email);
    if (!user) return; // Silent return for security

    await OtpModel.clearExisting(user.id, 'PASSWORD_RESET');

    const { otp, otpExpiry } = generateOtp(10);
    await OtpModel.create({
        userId: user.id,
        type: 'PASSWORD_RESET',
        otpHash: hashItem(otp),
        expiresAt: otpExpiry,
    });

    try {
        const html = passwordResetTemplate({ name: user.name, otp, expiryMinutes: 10 });
        await sendEmail({
            to: user.email,
            subject: 'TaskFlow Password Reset Request',
            html,
        });
    } catch (err) {
        console.error('Password reset email error:', err.message);
    }
};

/**
 * 9. Reset Password with OTP
 */
export const resetPassword = async ({ email, otp, password }) => {
    const user = await UserModel.findByEmail(email);
    if (!user) throw new AppError('Account not found.', 404);

    const otpRecord = await OtpModel.findActive(user.id, 'PASSWORD_RESET');
    if (!otpRecord) {
        throw new AppError('Invalid or expired password reset code.', 400);
    }

    if (otpRecord.attempts >= 5) {
        throw new AppError('Too many failed attempts. Please request a new recovery code.', 429);
    }

    const hashedInputOtp = hashItem(otp);
    if (otpRecord.otp_hash !== hashedInputOtp) {
        await OtpModel.incrementAttempts(otpRecord.id);
        throw new AppError('Invalid password reset code.', 400);
    }

    // Mark OTP used
    await OtpModel.markUsed(otpRecord.id);

    // Hash and update password
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    await UserModel.updatePassword(user.id, hashedPassword);

    // Invalidate all active user sessions for security
    await SessionModel.revokeAllForUser(user.id);

    // Send confirmation alert
    try {
        const html = passwordChangedTemplate({ name: user.name });
        await sendEmail({ to: user.email, subject: 'Security Notice: Password Updated', html });
    } catch (err) {
        console.error('Password changed email error:', err.message);
    }

    return { email: user.email };
};

/**
 * 10. Authenticated Change Password
 */
export const changePassword = async (userId, { currentPassword, newPassword }) => {
    const user = await UserModel.findByIdWithPassword(userId);
    if (!user) throw new AppError('User not found.', 404);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new AppError('Current password context validation mismatch.', 400);
    }

    const newHashedPassword = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
    await UserModel.updatePassword(userId, newHashedPassword);

    // Terminate all other active login sessions
    await SessionModel.revokeAllForUser(userId);

    // Dispatch security email
    try {
        const html = passwordChangedTemplate({ name: user.name });
        await sendEmail({ to: user.email, subject: 'Security Notice: Password Changed', html });
    } catch (err) {
        console.error('Password change email error:', err.message);
    }
};

/**
 * 11. Authenticated Update Profile Details
 */
export const updateProfile = async (userId, { name, avatar }) => {
    const user = await UserModel.updateProfile(userId, { name, avatar });
    if (!user) throw new AppError('User not found.', 404);
    return user;
};

export default {
    register,
    resendVerificationOtp,
    verifyEmailOtp,
    login,
    refreshAccessToken,
    logout,
    getMe,
    forgotPassword,
    resetPassword,
    changePassword,
    updateProfile,
};