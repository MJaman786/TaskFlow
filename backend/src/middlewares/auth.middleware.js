// ─── Authentication Middleware ──────────────────────────────────────────
// Verifies the Bearer JWT access token from request headers and confirms
// that the associated user session has not been revoked in Neon PostgreSQL.

import jwt from 'jsonwebtoken';
import AppError from '../common/AppError.js';
import envConfig from '../config/env.config.js';
import { pgPool } from '../config/db.config.js';

const protect = async (req, res, next) => {
    try {
        // 1. Extract Authorization header from incoming request
        const authHeader = req.headers.authorization;

        // 2. Validate header existence and format ("Bearer <token>")
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AppError('Authentication required. Please provide a valid Bearer token.', 401);
        }

        // 3. Extract raw token string
        const token = authHeader.split(' ')[1];

        // 4. Verify token cryptographic signature and expiration
        let decoded;
        try {
            decoded = jwt.verify(token, envConfig.jwt.accessSecret);
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                throw new AppError('Your access token has expired. Please refresh your session or log in again.', 401);
            }
            throw new AppError('Invalid access token. Verification failed.', 401);
        }

        // 5. Real-time Session Check in PostgreSQL:
        // Ensure the active session has not been explicitly revoked (e.g., after logout or password change)
        if (decoded.sessionId) {
            const sessionQuery = `
                SELECT id, revoked 
                FROM sessions 
                WHERE id = $1 AND user_id = $2 
                LIMIT 1
            `;
            const { rows } = await pgPool.query(sessionQuery, [decoded.sessionId, decoded.id]);

            if (rows.length === 0 || rows[0].revoked === true) {
                throw new AppError('Your login session has expired or been revoked. Please log in again.', 401);
            }
        }

        // 6. Verify that the user still exists and is ACTIVE
        const userQuery = `
            SELECT id, email, role, status 
            FROM users 
            WHERE id = $1 
            LIMIT 1
        `;
        const userResult = await pgPool.query(userQuery, [decoded.id]);

        if (userResult.rows.length === 0) {
            throw new AppError('The user account belonging to this token no longer exists.', 401);
        }

        const currentUser = userResult.rows[0];

        if (currentUser.status === 'SUSPENDED') {
            throw new AppError('Your account has been suspended. Please contact platform administration.', 403);
        }

        // 7. Attach validated user context to the request object for downstream controllers
        req.user = {
            id: currentUser.id,
            email: currentUser.email,
            role: currentUser.role,
            sessionId: decoded.sessionId || null,
        };

        next();
    } catch (error) {
        next(error);
    }
};

export default protect;