// ─── Time Tracking Service Layer ────────────────────────────────────────
// Business logic: single-timer enforcement, elapsed calculation, and task sync.

import { TimeTrackModel } from './timetrack.model.js';
import { TaskModel } from '../task/task.model.js';
import AppError from '../../common/AppError.js';
import { TASK_STATUS } from '../../common/constants.js';

/**
 * 1. Start real-time stopwatch on a task
 * Enforces rule: Only one task can have an active running timer at a time[cite: 4].
 */
export const startTimer = async (userId, taskId) => {
    // 1. Verify that the task exists and belongs to the user
    const task = await TaskModel.findByIdAndUser(taskId, userId);
    if (!task) {
        throw new AppError('Task not found or access denied.', 404);
    }

    // 2. Check if a timer is already running for this user
    const activeSession = await TimeTrackModel.findActiveSession(userId);
    if (activeSession) {
        throw new AppError(
            `A timer is already running on task "${activeSession.task_title}". Please stop it before starting a new timer.`,
            400
        );
    }

    // 3. Start the timer session
    const session = await TimeTrackModel.startSession(userId, taskId);

    // 4. Automatically update task status to IN_PROGRESS if it was PENDING
    if (task.status === TASK_STATUS.PENDING) {
        await TaskModel.update(taskId, userId, { status: TASK_STATUS.IN_PROGRESS });
    }

    return {
        ...session,
        taskTitle: task.title,
    };
};

/**
 * 2. Stop an active timer session
 * Computes duration, sets end_time, and commits log to database[cite: 4].
 */
export const stopTimer = async (userId, logId = null) => {
    let targetLogId = logId;

    // If logId wasn't explicitly passed, look up the user's current running session
    if (!targetLogId) {
        const activeSession = await TimeTrackModel.findActiveSession(userId);
        if (!activeSession) {
            throw new AppError('No active running timer was found to stop.', 400);
        }
        targetLogId = activeSession.id;
    }

    // Stop session in PostgreSQL
    const stoppedSession = await TimeTrackModel.stopSession(targetLogId, userId);
    if (!stoppedSession) {
        throw new AppError('Active session not found or already stopped.', 404);
    }

    // Get updated total time logged on this task
    const totalTaskSeconds = await TimeTrackModel.getTotalSecondsForTask(stoppedSession.task_id, userId);

    return {
        ...stoppedSession,
        totalTaskSeconds,
    };
};

/**
 * 3. Fetch currently active live timer with live elapsed time[cite: 4]
 */
export const getActiveTimer = async (userId) => {
    const activeSession = await TimeTrackModel.findActiveSession(userId);
    if (!activeSession) {
        return null;
    }

    // Calculate real-time elapsed seconds dynamically
    const startMs = new Date(activeSession.start_time).getTime();
    const currentElapsedSeconds = Math.max(0, Math.floor((Date.now() - startMs) / 1000));

    return {
        ...activeSession,
        currentElapsedSeconds,
    };
};

/**
 * 4. List all time logs with pagination and filters[cite: 4]
 */
export const listTimeLogs = async (userId, query) => {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 30;
    const offset = (page - 1) * limit;

    const { timeLogs, total } = await TimeTrackModel.findAllByUser(userId, {
        taskId: query.taskId,
        from: query.from,
        to: query.to,
        limit,
        offset,
    });

    return {
        timeLogs,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
        },
    };
};

/**
 * 5. Add a manual past time entry
 */
export const logManualTime = async (userId, { taskId, startTime, endTime }) => {
    const task = await TaskModel.findByIdAndUser(taskId, userId);
    if (!task) {
        throw new AppError('Task not found or access denied.', 404);
    }

    const start = new Date(startTime);
    const end = new Date(endTime);
    const durationSeconds = Math.floor((end.getTime() - start.getTime()) / 1000);

    if (durationSeconds <= 0) {
        throw new AppError('End time must be greater than start time.', 400);
    }

    return await TimeTrackModel.createManualLog({
        userId,
        taskId,
        startTime: start,
        endTime: end,
        durationSeconds,
    });
};

/**
 * 6. Delete a time log entry
 */
export const deleteTimeLog = async (logId, userId) => {
    const deleted = await TimeTrackModel.delete(logId, userId);
    if (!deleted) {
        throw new AppError('Time log entry not found or access denied.', 404);
    }
    return deleted;
};

export default {
    startTimer,
    stopTimer,
    getActiveTimer,
    listTimeLogs,
    logManualTime,
    deleteTimeLog,
};