// ─── Admin Service Layer ────────────────────────────────────────────────
// Business logic and database operations for platform administration.
// Only accessible by users with the 'ADMIN' role.

import { pgPool } from '../../config/db.config.js';
import AppError from '../../common/AppError.js';
import { sendEmail } from '../../shared/mail.js';
import accountDeletedTemplate from '../../templates/user/accountDeleted.template.js';

/**
 * 1. List all registered users with pagination, filters, and activity counts
 */
export const listUsers = async ({ page = 1, limit = 20, search = '', status = '' }) => {
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const offset = (pageNum - 1) * limitNum;

    let baseQuery = `
        SELECT 
            u.id, 
            u.name, 
            u.email, 
            u.role, 
            u.status, 
            u.avatar, 
            u.is_email_verified, 
            u.last_login, 
            u.created_at,
            COUNT(DISTINCT t.id)::INT AS total_tasks_created,
            COALESCE(SUM(tl.duration_seconds), 0)::INT AS total_logged_seconds
        FROM users u
        LEFT JOIN tasks t ON t.user_id = u.id
        LEFT JOIN time_logs tl ON tl.user_id = u.id AND tl.is_running = FALSE
        WHERE 1=1
    `;

    const queryParams = [];

    // Optional search by name or email
    if (search) {
        queryParams.push(`%${search.trim()}%`);
        baseQuery += ` AND (u.name ILIKE $${queryParams.length} OR u.email ILIKE $${queryParams.length})`;
    }

    // Optional filter by status (ACTIVE / SUSPENDED)
    if (status) {
        queryParams.push(status.toUpperCase().trim());
        baseQuery += ` AND u.status = $${queryParams.length}`;
    }

    baseQuery += `
        GROUP BY u.id
        ORDER BY u.created_at DESC
        LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2};
    `;

    queryParams.push(limitNum, offset);

    const { rows: users } = await pgPool.query(baseQuery, queryParams);

    // Compute total count for pagination metadata
    let countQuery = `SELECT COUNT(*) FROM users WHERE 1=1`;
    const countParams = [];

    if (search) {
        countParams.push(`%${search.trim()}%`);
        countQuery += ` AND (name ILIKE $${countParams.length} OR email ILIKE $${countParams.length})`;
    }
    if (status) {
        countParams.push(status.toUpperCase().trim());
        countQuery += ` AND status = $${countParams.length}`;
    }

    const countResult = await pgPool.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].count, 10);

    return {
        users,
        pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum) || 1,
        },
    };
};

/**
 * 2. Get detailed user profile by ID (including tasks and logged sessions)
 */
export const getUserById = async (userId) => {
    const userQuery = `
        SELECT 
            u.id, 
            u.name, 
            u.email, 
            u.role, 
            u.status, 
            u.avatar, 
            u.is_email_verified, 
            u.email_verified_at, 
            u.last_login, 
            u.created_at,
            COUNT(DISTINCT t.id)::INT AS total_tasks,
            COUNT(DISTINCT CASE WHEN t.status = 'COMPLETED' THEN t.id END)::INT AS completed_tasks,
            COALESCE(SUM(tl.duration_seconds), 0)::INT AS total_seconds_tracked
        FROM users u
        LEFT JOIN tasks t ON t.user_id = u.id
        LEFT JOIN time_logs tl ON tl.user_id = u.id AND tl.is_running = FALSE
        WHERE u.id = $1
        GROUP BY u.id
        LIMIT 1;
    `;
    const { rows } = await pgPool.query(userQuery, [userId]);

    if (rows.length === 0) {
        throw new AppError('User not found.', 404);
    }

    return rows[0];
};

/**
 * 3. Update User Status (ACTIVE vs SUSPENDED)
 */
export const setUserStatus = async (targetUserId, adminId, status) => {
    // Prevent an admin from suspending their own account
    if (targetUserId === adminId) {
        throw new AppError('Administrators cannot suspend their own account.', 400);
    }

    const query = `
        UPDATE users
        SET status = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, name, email, role, status, updated_at;
    `;
    const { rows } = await pgPool.query(query, [status, targetUserId]);

    if (rows.length === 0) {
        throw new AppError('User not found.', 404);
    }

    // If suspended, invalidate all their active login sessions immediately
    if (status === 'SUSPENDED') {
        await pgPool.query(
            `UPDATE sessions SET revoked = TRUE, logout_at = NOW() WHERE user_id = $1;`,
            [targetUserId]
        );
    }

    return rows[0];
};

/**
 * 4. Permanently Delete User
 * Cascades tasks, time logs, sessions, and sends notification email.
 */
export const deleteUser = async (targetUserId, adminId) => {
    // Prevent an admin from deleting their own account
    if (targetUserId === adminId) {
        throw new AppError('Administrators cannot delete their own account.', 400);
    }

    // Fetch user details prior to deletion for email dispatch
    const checkQuery = `SELECT id, name, email FROM users WHERE id = $1 LIMIT 1;`;
    const { rows: userRows } = await pgPool.query(checkQuery, [targetUserId]);

    if (userRows.length === 0) {
        throw new AppError('User not found.', 404);
    }

    const userToDelete = userRows[0];

    // Delete user from PostgreSQL (foreign key CASCADE removes tasks, sessions, otps, and time_logs)
    await pgPool.query(`DELETE FROM users WHERE id = $1;`, [targetUserId]);

    // Send account deletion confirmation email
    try {
        const html = accountDeletedTemplate({
            name: userToDelete.name,
            deletedAt: new Date().toLocaleString(),
        });

        await sendEmail({
            to: userToDelete.email,
            subject: 'TaskFlow Account Deletion Notice',
            html,
        });
    } catch (err) {
        console.error('Failed to send account deletion email:', err.message);
    }

    return {
        id: userToDelete.id,
        name: userToDelete.name,
        email: userToDelete.email,
    };
};

/**
 * 5. Platform-wide Aggregate Statistics
 */
export const getPlatformStats = async () => {
    const statsQuery = `
        SELECT 
            (SELECT COUNT(*) FROM users)::INT AS total_users,
            (SELECT COUNT(*) FROM users WHERE status = 'ACTIVE')::INT AS active_users,
            (SELECT COUNT(*) FROM users WHERE status = 'SUSPENDED')::INT AS suspended_users,
            (SELECT COUNT(*) FROM tasks)::INT AS total_tasks,
            (SELECT COUNT(*) FROM tasks WHERE status = 'COMPLETED')::INT AS completed_tasks,
            (SELECT COUNT(*) FROM time_logs WHERE is_running = TRUE)::INT AS active_timers_running,
            (SELECT COALESCE(SUM(duration_seconds), 0) FROM time_logs WHERE is_running = FALSE)::BIGINT AS total_seconds_tracked,
            (SELECT ROUND(COALESCE(SUM(duration_seconds), 0) / 3600.0, 1) FROM time_logs WHERE is_running = FALSE)::FLOAT AS total_hours_tracked;
    `;
    const { rows } = await pgPool.query(statsQuery);
    return rows[0];
};

export default {
    listUsers,
    getUserById,
    setUserStatus,
    deleteUser,
    getPlatformStats,
};