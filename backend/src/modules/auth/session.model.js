// ─── Session Database Model (PostgreSQL Queries) ────────────────────────
// Tracks active refresh tokens, client devices, and handles session revocation.

import { pgPool } from '../../config/db.config.js';

export const SessionModel = {
    /**
     * Create a new active session
     */
    create: async ({ userId, refreshTokenHash, ip, userAgent }) => {
        const query = `
            INSERT INTO sessions (user_id, refresh_token_hash, ip, user_agent)
            VALUES ($1, $2, $3, $4)
            RETURNING id, user_id, login_at;
        `;
        const { rows } = await pgPool.query(query, [userId, refreshTokenHash, ip, userAgent]);
        return rows[0];
    },

    /**
     * Find a session by its UUID
     */
    findById: async (id) => {
        const query = `
            SELECT id, user_id, refresh_token_hash, ip, user_agent, revoked, login_at, logout_at
            FROM sessions
            WHERE id = $1
            LIMIT 1;
        `;
        const { rows } = await pgPool.query(query, [id]);
        return rows[0] || null;
    },

    /**
     * Update session with a new rotated refresh token hash
     */
    rotateToken: async (id, newRefreshTokenHash, ip, userAgent) => {
        const query = `
            UPDATE sessions
            SET refresh_token_hash = $1, ip = $2, user_agent = $3
            WHERE id = $4;
        `;
        await pgPool.query(query, [newRefreshTokenHash, ip, userAgent, id]);
    },

    /**
     * Revoke a single session by ID (e.g., standard logout)
     */
    revokeById: async (id, userId) => {
        const query = `
            UPDATE sessions
            SET revoked = TRUE, logout_at = NOW()
            WHERE id = $1 AND user_id = $2;
        `;
        await pgPool.query(query, [id, userId]);
    },

    /**
     * Revoke all active sessions for a user (e.g., password reset or security revocation)
     */
    revokeAllForUser: async (userId) => {
        const query = `
            UPDATE sessions
            SET revoked = TRUE, logout_at = NOW()
            WHERE user_id = $1 AND revoked = FALSE;
        `;
        await pgPool.query(query, [userId]);
    },
};