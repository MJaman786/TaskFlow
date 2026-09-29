// ─── User Database Model (PostgreSQL Queries) ───────────────────────────
// Centralized SQL queries for interacting with the `users` table.

import { pgPool } from '../../config/db.config.js';

export const UserModel = {
    /**
     * Find a user by email address
     * @param {string} email
     * @param {boolean} includePassword - Whether to select the password hash
     */
    findByEmail: async (email, includePassword = false) => {
        const query = `
            SELECT 
                id, name, email, role, status, avatar,
                is_email_verified, email_verified_at, last_login,
                created_at, updated_at
                ${includePassword ? ', password' : ''}
            FROM users
            WHERE email = $1
            LIMIT 1;
        `;
        const { rows } = await pgPool.query(query, [email.toLowerCase().trim()]);
        return rows[0] || null;
    },

    /**
     * Find a user by their UUID primary key
     * @param {string} id
     */
    findById: async (id) => {
        const query = `
            SELECT 
                id, name, email, role, status, avatar,
                is_email_verified, email_verified_at, last_login,
                created_at, updated_at
            FROM users
            WHERE id = $1
            LIMIT 1;
        `;
        const { rows } = await pgPool.query(query, [id]);
        return rows[0] || null;
    },

    /**
     * Find a user by ID with password hash (for change-password verification)
     * @param {string} id
     */
    findByIdWithPassword: async (id) => {
        const query = `
            SELECT id, name, email, password, role, status 
            FROM users 
            WHERE id = $1 
            LIMIT 1;
        `;
        const { rows } = await pgPool.query(query, [id]);
        return rows[0] || null;
    },

    /**
     * Create a new user record
     */
    create: async ({ name, email, password, role = 'USER' }) => {
        const query = `
            INSERT INTO users (name, email, password, role, status, is_email_verified)
            VALUES ($1, $2, $3, $4, 'ACTIVE', FALSE)
            RETURNING id, name, email, role, status, is_email_verified, created_at;
        `;
        const values = [name.trim(), email.toLowerCase().trim(), password, role];
        const { rows } = await pgPool.query(query, values);
        return rows[0];
    },

    /**
     * Update user details if an unverified account re-registers
     */
    updateUnverifiedUser: async ({ id, name, password, role }) => {
        const query = `
            UPDATE users
            SET name = $1, password = $2, role = $3, updated_at = NOW()
            WHERE id = $4
            RETURNING id, name, email, role, status, is_email_verified;
        `;
        const { rows } = await pgPool.query(query, [name.trim(), password, role, id]);
        return rows[0];
    },

    /**
     * Mark email as verified
     */
    markEmailVerified: async (id) => {
        const query = `
            UPDATE users
            SET is_email_verified = TRUE, email_verified_at = NOW(), updated_at = NOW()
            WHERE id = $1
            RETURNING id, name, email, is_email_verified;
        `;
        const { rows } = await pgPool.query(query, [id]);
        return rows[0];
    },

    /**
     * Update user password hash
     */
    updatePassword: async (id, passwordHash) => {
        const query = `
            UPDATE users
            SET password = $1, updated_at = NOW()
            WHERE id = $2;
        `;
        await pgPool.query(query, [passwordHash, id]);
    },

    /**
     * Update user's last login timestamp
     */
    updateLastLogin: async (id) => {
        const query = `
            UPDATE users
            SET last_login = NOW()
            WHERE id = $1;
        `;
        await pgPool.query(query, [id]);
    },

    /**
     * Update user profile details (name, avatar)
     */
    updateProfile: async (id, { name, avatar }) => {
        const query = `
            UPDATE users
            SET 
                name = COALESCE($1, name),
                avatar = COALESCE($2, avatar),
                updated_at = NOW()
            WHERE id = $3
            RETURNING id, name, email, role, status, avatar, updated_at;
        `;
        const { rows } = await pgPool.query(query, [name, avatar, id]);
        return rows[0];
    },
};