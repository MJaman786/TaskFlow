// ─── Dashboard & Analytics Service Layer ────────────────────────────────
// Aggregates productivity metrics, calendar heatmap data, and streaks.

import { pgPool } from '../../config/db.config.js';
import { TimeTrackModel } from '../timetrack/timetrack.model.js';

/**
 * 1. Calculate Active Streaks
 * Computes current streak, longest streak, and total days active.
 * @param {string[]} activeDates - Array of sorted 'YYYY-MM-DD' date strings
 */
const calculateStreaks = (activeDates) => {
    if (!activeDates || activeDates.length === 0) {
        return { currentStreak: 0, longestStreak: 0, daysActive: 0 };
    }

    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate = null;

    // Iterate through sorted dates to compute the longest continuous chain
    for (const dateStr of activeDates) {
        const currentDate = new Date(dateStr);

        if (prevDate) {
            const diffTime = currentDate.getTime() - prevDate.getTime();
            const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

            if (diffDays === 1) {
                tempStreak += 1;
            } else if (diffDays > 1) {
                tempStreak = 1;
            }
        } else {
            tempStreak = 1;
        }

        if (tempStreak > longestStreak) {
            longestStreak = tempStreak;
        }
        prevDate = currentDate;
    }

    // Determine current active streak relative to today
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const latestActiveDateStr = activeDates[activeDates.length - 1];
    const latestDate = new Date(latestActiveDateStr);
    latestDate.setHours(0, 0, 0, 0);

    // Current streak is valid only if user was active today or yesterday
    if (latestDate.getTime() === today.getTime() || latestDate.getTime() === yesterday.getTime()) {
        currentStreak = 1;
        let checkDate = new Date(latestDate);

        for (let i = activeDates.length - 2; i >= 0; i--) {
            const priorDate = new Date(activeDates[i]);
            priorDate.setHours(0, 0, 0, 0);

            const diff = Math.round((checkDate.getTime() - priorDate.getTime()) / (1000 * 3600 * 24));
            if (diff === 1) {
                currentStreak += 1;
                checkDate = priorDate;
            } else {
                break;
            }
        }
    }

    return {
        currentStreak,
        longestStreak,
        daysActive: activeDates.length,
    };
};

/**
 * 2. Get Daily Summary (Today's Productivity Snapshot)[cite: 4]
 * Returns tasks worked on today, total seconds tracked, completed tasks,
 * and count of pending or in-progress tasks[cite: 4].
 */
export const getDailySummary = async (userId) => {
    // 1. Fetch total time logged and count of sessions for today
    const todayLogsQuery = `
        SELECT 
            COALESCE(SUM(duration_seconds), 0)::INT AS total_seconds_today,
            COUNT(id)::INT AS total_sessions_today
        FROM time_logs
        WHERE user_id = $1 
          AND DATE(start_time) = CURRENT_DATE 
          AND is_running = FALSE;
    `;
    const todayLogsRes = await pgPool.query(todayLogsQuery, [userId]);
    const { total_seconds_today, total_sessions_today } = todayLogsRes.rows[0];

    // 2. Fetch distinct tasks worked on today[cite: 4]
    const tasksWorkedOnQuery = `
        SELECT DISTINCT 
            t.id, t.title, t.status, t.priority,
            SUM(tl.duration_seconds)::INT AS time_spent_today_seconds
        FROM tasks t
        JOIN time_logs tl ON tl.task_id = t.id
        WHERE tl.user_id = $1 AND DATE(tl.start_time) = CURRENT_DATE
        GROUP BY t.id
        ORDER BY time_spent_today_seconds DESC;
    `;
    const tasksWorkedRes = await pgPool.query(tasksWorkedOnQuery, [userId]);

    // 3. Aggregate general task status counts for the user
    const taskStatusCountsQuery = `
        SELECT 
            COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END)::INT AS completed_tasks,
            COUNT(CASE WHEN status = 'IN_PROGRESS' THEN 1 END)::INT AS in_progress_tasks,
            COUNT(CASE WHEN status = 'PENDING' THEN 1 END)::INT AS pending_tasks,
            COUNT(id)::INT AS total_tasks
        FROM tasks
        WHERE user_id = $1;
    `;
    const statusCountsRes = await pgPool.query(taskStatusCountsQuery, [userId]);
    const statusCounts = statusCountsRes.rows[0];

    // 4. Check for an active running stopwatch session
    const activeSession = await TimeTrackModel.findActiveSession(userId);
    let runningTimer = null;
    if (activeSession) {
        const startMs = new Date(activeSession.start_time).getTime();
        runningTimer = {
            ...activeSession,
            currentElapsedSeconds: Math.max(0, Math.floor((Date.now() - startMs) / 1000)),
        };
    }

    return {
        date: new Date().toISOString().split('T')[0],
        totalTimeTrackedSeconds: total_seconds_today,
        totalTimeTrackedMinutes: Math.round(total_seconds_today / 60),
        totalSessionsToday: total_sessions_today,
        tasksWorkedOn: tasksWorkedRes.rows,
        completedTasksCount: statusCounts.completed_tasks,
        inProgressTasksCount: statusCounts.in_progress_tasks,
        pendingTasksCount: statusCounts.pending_tasks,
        totalTasksCount: statusCounts.total_tasks,
        activeTimer: runningTimer,
    };
};

/**
 * 3. Get Annual Activity Matrix & Streaks[cite: 3, 5, 6]
 * Aggregates daily sessions, total logged minutes, and intensity levels across a year[cite: 5, 6].
 */
export const getActivityMatrix = async (userId, targetYear = new Date().getFullYear()) => {
    const year = parseInt(targetYear, 10);

    // 1. Group daily time log sessions for the specified calendar year
    const matrixQuery = `
        SELECT 
            TO_CHAR(start_time, 'YYYY-MM-DD') AS log_date,
            COUNT(id)::INT AS session_count,
            COALESCE(SUM(duration_seconds), 0)::INT AS total_seconds,
            ROUND(COALESCE(SUM(duration_seconds), 0) / 60.0)::INT AS total_minutes
        FROM time_logs
        WHERE user_id = $1 
          AND EXTRACT(YEAR FROM start_time) = $2
          AND is_running = FALSE
        GROUP BY TO_CHAR(start_time, 'YYYY-MM-DD')
        ORDER BY log_date ASC;
    `;
    const matrixRes = await pgPool.query(matrixQuery, [userId, year]);

    // 2. Map intensity levels matching the UI specification:[cite: 5, 6]
    // Intensity tiers: 0 (Blank), 1–5, 6–10, 10+
    const dailyContributions = matrixRes.rows.map((row) => {
        let intensity = '0 (Blank)';
        const count = row.session_count;

        if (count >= 1 && count <= 5) {
            intensity = '1-5';
        } else if (count >= 6 && count <= 10) {
            intensity = '6-10';
        } else if (count > 10) {
            intensity = '10+';
        }

        return {
            date: row.log_date,
            sessionCount: row.session_count,
            totalSeconds: row.total_seconds,
            totalMinutes: row.total_minutes,
            intensity,
        };
    });

    // 3. Query all distinct lifetime active dates for streak calculation[cite: 3, 5, 6]
    const lifetimeDatesQuery = `
        SELECT DISTINCT TO_CHAR(start_time, 'YYYY-MM-DD') AS active_date
        FROM time_logs
        WHERE user_id = $1 AND is_running = FALSE
        ORDER BY active_date ASC;
    `;
    const lifetimeDatesRes = await pgPool.query(lifetimeDatesQuery, [userId]);
    const lifetimeDates = lifetimeDatesRes.rows.map((r) => r.active_date);

    // Calculate streaks
    const streaks = calculateStreaks(lifetimeDates);

    // Compute total year contributions
    const totalYearContributions = dailyContributions.reduce(
        (sum, item) => sum + item.sessionCount,
        0
    );

    return {
        year,
        totalContributions: totalYearContributions,
        streaks,
        dailyContributions,
    };
};

/**
 * 4. Get Task Overview Breakdown (Donut Charts & Distribution)[cite: 3]
 */
export const getTaskOverview = async (userId) => {
    // 1. Status breakdown (PENDING, IN_PROGRESS, COMPLETED)
    const statusQuery = `
        SELECT status, COUNT(id)::INT AS count
        FROM tasks
        WHERE user_id = $1
        GROUP BY status;
    `;
    const statusRes = await pgPool.query(statusQuery, [userId]);

    // 2. Priority breakdown (LOW, MEDIUM, HIGH)
    const priorityQuery = `
        SELECT priority, COUNT(id)::INT AS count
        FROM tasks
        WHERE user_id = $1
        GROUP BY priority;
    `;
    const priorityRes = await pgPool.query(priorityQuery, [userId]);

    // 3. Lifetime tracked time
    const lifetimeTimeQuery = `
        SELECT 
            COALESCE(SUM(duration_seconds), 0)::INT AS total_seconds,
            ROUND(COALESCE(SUM(duration_seconds), 0) / 3600.0, 1)::FLOAT AS total_hours
        FROM time_logs
        WHERE user_id = $1 AND is_running = FALSE;
    `;
    const timeRes = await pgPool.query(lifetimeTimeQuery, [userId]);

    return {
        statusBreakdown: statusRes.rows,
        priorityBreakdown: priorityRes.rows,
        totalLoggedTime: timeRes.rows[0],
    };
};

/**
 * 5. Consolidated Dashboard Feed
 * Returns all dashboard modules in a single payload for efficient client hydration.
 */
export const getConsolidatedDashboard = async (userId, year) => {
    const [dailySummary, activityMatrix, taskOverview] = await Promise.all([
        getDailySummary(userId),
        getActivityMatrix(userId, year),
        getTaskOverview(userId),
    ]);

    return {
        dailySummary,
        activityMatrix,
        taskOverview,
    };
};

export default {
    getDailySummary,
    getActivityMatrix,
    getTaskOverview,
    getConsolidatedDashboard,
};