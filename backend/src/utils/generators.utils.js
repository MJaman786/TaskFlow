// ─── Token, Hash & Random String Generators ─────────────────────────────
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import envConfig from '../config/env.config.js';

// Generates short-lived Access Token (JWT)
export const generateAccessToken = (payload) => {
    return jwt.sign(payload, envConfig.jwt.accessSecret, {
        expiresIn: envConfig.jwt.accessExpiresIn,
    });
};

// Generates long-lived Refresh Token (JWT)
export const generateRefreshToken = (payload) => {
    return jwt.sign(payload, envConfig.jwt.refreshSecret, {
        expiresIn: envConfig.jwt.refreshExpiresIn,
    });
};

// Hashes sensitive tokens or OTPs using SHA-256 before database storage
export const hashItem = (item) => {
    return crypto.createHash('sha256').update(String(item)).digest('hex');
};

// Generates 6-digit numeric OTP with configurable expiration time
export const generateOtp = (expiryMinutes = 10) => {
    const otpExpiry = new Date(Date.now() + expiryMinutes * 60 * 1000);
    const formattedExpiry = otpExpiry.toLocaleString('en-IN', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });

    return {
        otp: crypto.randomInt(100000, 999999).toString(),
        otpExpiry,
        formattedExpiry,
    };
};

// Generates cryptographic random hex string (e.g., for verification links)
export const generateRandomToken = () => {
    return crypto.randomBytes(32).toString('hex');
};