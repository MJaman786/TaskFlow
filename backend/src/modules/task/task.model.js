// ─── Task Database Model (PostgreSQL Queries) ───────────────────────────
// Centralized SQL queries for interacting with the `tasks` table.
// All queries enforce user data isolation by scoping where `user_id = $x`.

import { pgPool } from '../../config/db.config.js';

export const TaskModel = {
    /**
     * Fetch all tasks for a specific user with filtering, search, and pagination
     */
    findAllByUser: async (userId, { status, priority, search, limit = 20, offset = 0 }) => {
        let baseQuery = `
            SELECT 
                t.id, t.user_id, t.title, t.description, t.status, t.priority,
                t.due_date, t.created_at, t.updated_at,
                COALESCE(SUM(tl.duration_seconds), 0)::INT AS total_time_spent_seconds,
                BOOL_OR(tl.is_running) AS has_active_timer
            FROM tasks t
            LEFT JOIN time_logs tl ON tl.task_id = t.id
            WHERE t.user_id = $1
        `;

        const queryParams = [userId];

        // 1. Optional filter by task status (PENDING, IN_PROGRESS, COMPLETED)
        if (status) {
            queryParams.push(status);
            baseQuery += ` AND t.status = $${queryParams.length}`;
        }

        // 2. Optional filter by priority (LOW, MEDIUM, HIGH)
        if (priority) {
            queryParams.push(priority);
            baseQuery += ` AND t.priority = $${queryParams.length}`;
        }

        // 3. Optional case-insensitive search in title or description
        if (search) {
            queryParams.push(`%${search}%`);
            baseQuery += ` AND (t.title ILIKE $${queryParams.length} OR t.description ILIKE $${queryParams.length})`;
        }

        baseQuery += `
            GROUP BY t.id
            ORDER BY t.created_at DESC
            LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2};
        `;

        queryParams.push(limit, offset);

        const { rows } = await pgPool.query(baseQuery, queryParams);

        // Separate query for total count (for accurate pagination meta)
        let countQuery = `SELECT COUNT(*) FROM tasks WHERE user_id = $1`;
        const countParams = [userId];

        if (status) {
            countParams.push(status);
            countQuery += ` AND status = $${countParams.length}`;
        }
        if (priority) {
            countParams.push(priority);
            countQuery += ` AND priority = $${countParams.length}`;
        }
        if (search) {
            countParams.push(`%${search}%`);
            countQuery += ` AND (title ILIKE $${countParams.length} OR description ILIKE $${countParams.length})`;
        }

        const countResult = await pgPool.query(countQuery, countParams);
        const total = parseInt(countResult.rows[0].count, 10);

        return { tasks: rows, total };
    },

    /**
     * Find a single task by ID ensuring it belongs to the authenticated user
     */
    findByIdAndUser: async (taskId, userId) => {
        const query = `
            SELECT 
                t.id, t.user_id, t.title, t.description, t.status, t.priority,
                t.due_date, t.created_at, t.updated_at,
                COALESCE(SUM(tl.duration_seconds), 0)::INT AS total_time_spent_seconds,
                BOOL_OR(tl.is_running) AS has_active_timer
            FROM tasks t
            LEFT JOIN time_logs tl ON tl.task_id = t.id
            WHERE t.id = $1 AND t.user_id = $2
            GROUP BY t.id
            LIMIT 1;
        `;
        const { rows } = await pgPool.query(query, [taskId, userId]);
        return rows[0] || null;
    },

    /**
     * Create a new task entry
     */
    create: async ({ userId, title, description, status = 'PENDING', priority = 'MEDIUM', dueDate = null }) => {
        const query = `
            INSERT INTO tasks (user_id, title, description, status, priority, due_date)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, user_id, title, description, status, priority, due_date, created_at, updated_at;
        `;
        const values = [userId, title.trim(), description ? description.trim() : '', status, priority, dueDate];
        const { rows } = await pgPool.query(query, values);
        return rows[0];
    },

    /**
     * Update an existing task (partial update using COALESCE)
     */
    update: async (taskId, userId, { title, description, status, priority, dueDate }) => {
        const query = `
            UPDATE tasks
            SET 
                title       = COALESCE($1, title),
                description = COALESCE($2, description),
                status      = COALESCE($3, status),
                priority    = COALESCE($4, priority),
                due_date    = COALESCE($5, due_date),
                updated_at  = NOW()
            WHERE id = $6 AND user_id = $7
            RETURNING id, user_id, title, description, status, priority, due_date, created_at, updated_at;
        `;
        const values = [
            title ? title.trim() : null,
            description !== undefined ? description.trim() : null,
            status || null,
            priority || null,
            dueDate !== undefined ? dueDate : null,
            taskId,
            userId,
        ];

        const { rows } = await pgPool.query(query, values);
        return rows[0] || null;
    },

    /**
     * Delete a task permanently by ID (cascades and purges associated time logs)
     */
    delete: async (taskId, userId) => {
        const query = `
            DELETE FROM tasks
            WHERE id = $1 AND user_id = $2
            RETURNING id, title;
        `;
        const { rows } = await pgPool.query(query, [taskId, userId]);
        return rows[0] || null;
    },
};