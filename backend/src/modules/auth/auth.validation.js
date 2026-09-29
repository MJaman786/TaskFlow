// ─── Authentication Joi Validation Schemas ──────────────────────────────
// Validates incoming HTTP request payloads for all authentication endpoints.

import Joi from 'joi';

// User Registration Schema
export const registerSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required().messages({
        'string.min': 'Name must be at least 2 characters',
        'any.required': 'Name is required',
    }),
    email: Joi.string().trim().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    password: Joi.string().min(6).max(128).required().messages({
        'string.min': 'Password must be at least 6 characters long',
        'any.required': 'Password is required',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Please confirm your password',
    }),
    role: Joi.string().valid('USER', 'ADMIN').default('USER').messages({
        'any.only': 'Role must be either USER or ADMIN',
    }),
});

// User Login Schema
export const loginSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    password: Joi.string().required().messages({
        'any.required': 'Password is required',
    }),
});

// Verify 6-digit Email OTP Schema
export const verifyEmailSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    otp: Joi.string().trim().length(6).required().messages({
        'string.length': 'OTP must be exactly 6 digits',
        'any.required': 'OTP is required',
    }),
});

// Resend Verification OTP Schema
export const resendVerificationSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
});

// Forgot Password Request Schema
export const forgotPasswordSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
});

// Reset Password with OTP Schema
export const resetPasswordSchema = Joi.object({
    email: Joi.string().trim().email().required().messages({
        'string.email': 'Please provide a valid email address',
        'any.required': 'Email is required',
    }),
    otp: Joi.string().trim().length(6).required().messages({
        'string.length': 'OTP must be exactly 6 digits',
        'any.required': 'OTP is required',
    }),
    password: Joi.string().min(6).max(128).required().messages({
        'string.min': 'New password must be at least 6 characters long',
        'any.required': 'New password is required',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Please confirm your new password',
    }),
});

// Authenticated Change Password Schema
export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string().required().messages({
        'any.required': 'Current password is required',
    }),
    newPassword: Joi.string().min(6).max(128).required().messages({
        'string.min': 'New password must be at least 6 characters long',
        'any.required': 'New password is required',
    }),
    confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required().messages({
        'any.only': 'Passwords do not match',
        'any.required': 'Please confirm your new password',
    }),
});

// Authenticated Profile Update Schema
export const updateProfileSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    avatar: Joi.string().trim().uri().allow(null, '').optional(),
});