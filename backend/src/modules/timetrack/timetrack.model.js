// ─── Time Tracking Database Model (PostgreSQL Queries) ──────────────────
// Handles SQL queries for live start/stop stopwatch logs and historical entries.

import { pgPool } from '../../config/db.config.js';

export const TimeTrackModel = {
    /**
     * Find currently active running timer for a user (if any)
     */
    findActiveSession: async (userId) => {
        const query = `
            SELECT 
                tl.id, tl.user_id, tl.task_id, tl.start_time, tl.is_running,
                t.title AS task_title, t.status AS task_status, t.priority AS task_priority
            FROM time_logs tl
            JOIN tasks t ON t.id = tl.task_id
            WHERE tl.user_id = $1 AND tl.is_running = TRUE
            LIMIT 1;
        `;
        const { rows } = await pgPool.query(query, [userId]);
        return rows[0] || null;
    },

    /**
     * Start a new tracking session
     */
    startSession: async (userId, taskId) => {
        const query = `
            INSERT INTO time_logs (user_id, task_id, start_time, is_running)
            VALUES ($1, $2, NOW(), TRUE)
            RETURNING id, user_id, task_id, start_time, is_running, created_at;
        `;
        const { rows } = await pgPool.query(query, [userId, taskId]);
        return rows[0];
    },

    /**
     * Stop a running timer session and calculate elapsed seconds
     */
    stopSession: async (logId, userId) => {
        const query = `
            UPDATE time_logs
            SET 
                end_time = NOW(),
                duration_seconds = GREATEST(1, EXTRACT(EPOCH FROM (NOW() - start_time))::INT),
                is_running = FALSE,
                updated_at = NOW()
            WHERE id = $1 AND user_id = $2 AND is_running = TRUE
            RETURNING id, user_id, task_id, start_time, end_time, duration_seconds, is_running;
        `;
        const { rows } = await pgPool.query(query, [logId, userId]);
        return rows[0] || null;
    },

    /**
     * Record a manual time log entry
     */
    createManualLog: async ({ userId, taskId, startTime, endTime, durationSeconds }) => {
        const query = `
            INSERT INTO time_logs (user_id, task_id, start_time, end_time, duration_seconds, is_running)
            VALUES ($1, $2, $3, $4, $5, FALSE)
            RETURNING id, user_id, task_id, start_time, end_time, duration_seconds, created_at;
        `;
        const values = [userId, taskId, startTime, endTime, durationSeconds];
        const { rows } = await pgPool.query(query, values);
        return rows[0];
    },

    /**
     * List all time logs for a user with optional task and date filtering
     */
    findAllByUser: async (userId, { taskId, from, to, limit = 30, offset = 0 }) => {
        let baseQuery = `
            SELECT 
                tl.id, tl.user_id, tl.task_id, tl.start_time, tl.end_time,
                tl.duration_seconds, tl.is_running, tl.created_at,
                t.title AS task_title, t.status AS task_status, t.priority AS task_priority
            FROM time_logs tl
            JOIN tasks t ON t.id = tl.task_id
            WHERE tl.user_id = $1
        `;

        const queryParams = [userId];

        if (taskId) {
            queryParams.push(taskId);
            baseQuery += ` AND tl.task_id = $${queryParams.length}`;
        }

        if (from) {
            queryParams.push(from);
            baseQuery += ` AND tl.start_time >= $${queryParams.length}`;
        }

        if (to) {
            queryParams.push(to);
            baseQuery += ` AND tl.start_time <= $${queryParams.length}`;
        }

        baseQuery += `
            ORDER BY tl.start_time DESC
            LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2};
        `;

        queryParams.push(limit, offset);

        const { rows } = await pgPool.query(baseQuery, queryParams);

        // Count total matching logs
        let countQuery = `SELECT COUNT(*) FROM time_logs WHERE user_id = $1`;
        const countParams = [userId];

        if (taskId) {
            countParams.push(taskId);
            countQuery += ` AND task_id = $${countParams.length}`;
        }
        if (from) {
            countParams.push(from);
            countQuery += ` AND start_time >= $${countParams.length}`;
        }
        if (to) {
            countParams.push(to);
            countQuery += ` AND start_time <= $${countParams.length}`;
        }

        const countResult = await pgPool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].count, 10);

        return { timeLogs: rows, total };
    },

    /**
     * Find a single time log by ID
     */
    findByIdAndUser: async (logId, userId) => {
        const query = `
            SELECT 
                tl.id, tl.user_id, tl.task_id, tl.start_time, tl.end_time,
                tl.duration_seconds, tl.is_running, tl.created_at,
                t.title AS task_title
            FROM time_logs tl
            JOIN tasks t ON t.id = tl.task_id
            WHERE tl.id = $1 AND tl.user_id = $2
            LIMIT 1;
        `;
        const { rows } = await pgPool.query(query, [logId, userId]);
        return rows[0] || null;
    },

    /**
     * Permanently delete a time log entry
     */
    delete: async (logId, userId) => {
        const query = `
            DELETE FROM time_logs
            WHERE id = $1 AND user_id = $2
            RETURNING id;
        `;
        const { rows } = await pgPool.query(query, [logId, userId]);
        return rows[0] || null;
    },

    /**
     * Get aggregate total time spent across all sessions for a specific task
     */
    getTotalSecondsForTask: async (taskId, userId) => {
        const query = `
            SELECT COALESCE(SUM(duration_seconds), 0)::INT AS total_seconds
            FROM time_logs
            WHERE task_id = $1 AND user_id = $2 AND is_running = FALSE;
        `;
        const { rows } = await pgPool.query(query, [taskId, userId]);
        return rows[0]?.total_seconds || 0;
    },
};