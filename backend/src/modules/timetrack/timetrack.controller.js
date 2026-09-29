// ─── Time Tracking Controller Layer ─────────────────────────────────────
// Handles HTTP request lifecycle for Stopwatch and Time Log management.

import asyncHandler from '../../common/asyncHandler.js';
import { sendSuccess } from '../../common/response.js';
import timetrackService from './timetrack.service.js';

// POST /api/v1/time-logs/start[cite: 4]
export const startTimer = asyncHandler(async (req, res) => {
    const session = await timetrackService.startTimer(req.user.id, req.body.taskId);
    return sendSuccess(res, {
        statusCode: 201,
        message: 'Timer started successfully.',
        data: { session },
    });
});

// POST /api/v1/time-logs/stop[cite: 4]
export const stopTimer = asyncHandler(async (req, res) => {
    const session = await timetrackService.stopTimer(req.user.id, req.body.logId);
    return sendSuccess(res, {
        message: 'Timer stopped and session duration logged successfully.',
        data: { session },
    });
});

// GET /api/v1/time-logs/active[cite: 4]
export const getActiveTimer = asyncHandler(async (req, res) => {
    const activeTimer = await timetrackService.getActiveTimer(req.user.id);
    return sendSuccess(res, {
        message: activeTimer ? 'Active running timer found.' : 'No active timer is currently running.',
        data: { activeTimer },
    });
});

// GET /api/v1/time-logs[cite: 4]
export const getTimeLogs = asyncHandler(async (req, res) => {
    const { timeLogs, pagination } = await timetrackService.listTimeLogs(req.user.id, req.query);
    return sendSuccess(res, {
        message: 'Time logs retrieved successfully.',
        data: { timeLogs },
        pagination,
    });
});

// POST /api/v1/time-logs/manual
export const logManualTime = asyncHandler(async (req, res) => {
    const log = await timetrackService.logManualTime(req.user.id, req.body);
    return sendSuccess(res, {
        statusCode: 201,
        message: 'Manual time entry logged successfully.',
        data: { log },
    });
});

// DELETE /api/v1/time-logs/:id
export const deleteTimeLog = asyncHandler(async (req, res) => {
    await timetrackService.deleteTimeLog(req.params.id, req.user.id);
    return sendSuccess(res, {
        message: 'Time log deleted successfully.',
        data: null,
    });
});