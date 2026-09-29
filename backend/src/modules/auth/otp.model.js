// ─── OTP Database Model (PostgreSQL Queries) ────────────────────────────
// Stores hashed 6-digit verification codes for registration and password resets.

import { pgPool } from '../../config/db.config.js';

export const OtpModel = {
    /**
     * Invalidate any prior active OTPs of the same type for a user
     */
    clearExisting: async (userId, type) => {
        const query = `
            DELETE FROM otps
            WHERE user_id = $1 AND type = $2;
        `;
        await pgPool.query(query, [userId, type]);
    },

    /**
     * Create a new OTP record
     */
    create: async ({ userId, type, otpHash, expiresAt }) => {
        const query = `
            INSERT INTO otps (user_id, type, otp_hash, expires_at)
            VALUES ($1, $2, $3, $4)
            RETURNING id, type, expires_at;
        `;
        const { rows } = await pgPool.query(query, [userId, type, otpHash, expiresAt]);
        return rows[0];
    },

    /**
     * Find active, non-expired OTP record for a user
     */
    findActive: async (userId, type) => {
        const query = `
            SELECT id, user_id, type, otp_hash, attempts, used, expires_at
            FROM otps
            WHERE user_id = $1 
              AND type = $2 
              AND used = FALSE 
              AND expires_at > NOW()
            ORDER BY created_at DESC
            LIMIT 1;
        `;
        const { rows } = await pgPool.query(query, [userId, type]);
        return rows[0] || null;
    },

    /**
     * Increment failed verification attempts count
     */
    incrementAttempts: async (id) => {
        const query = `
            UPDATE otps
            SET attempts = attempts + 1
            WHERE id = $1;
        `;
        await pgPool.query(query, [id]);
    },

    /**
     * Mark OTP as consumed/used
     */
    markUsed: async (id) => {
        const query = `
            UPDATE otps
            SET used = TRUE
            WHERE id = $1;
        `;
        await pgPool.query(query, [id]);
    },

    /**
     * Check if a recent OTP was created within 60 seconds (rate limiting)
     */
    hasRecentOtp: async (userId, type) => {
        const query = `
            SELECT id FROM otps
            WHERE user_id = $1 
              AND type = $2 
              AND created_at > (NOW() - INTERVAL '60 seconds')
            LIMIT 1;
        `;
        const { rows } = await pgPool.query(query, [userId, type]);
        return rows.length > 0;
    },
};