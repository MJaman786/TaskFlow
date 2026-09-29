// ─── Dashboard Controller Layer ─────────────────────────────────────────
// Handles HTTP request lifecycle for Daily Summaries, Heatmaps, and Metrics.

import asyncHandler from '../../common/asyncHandler.js';
import { sendSuccess } from '../../common/response.js';
import dashboardService from './dashboard.service.js';

// GET /api/v1/dashboard
// Returns complete consolidated dashboard payload in one request
export const getDashboard = asyncHandler(async (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const dashboardData = await dashboardService.getConsolidatedDashboard(req.user.id, year);

    return sendSuccess(res, {
        message: 'Dashboard data retrieved successfully.',
        data: dashboardData,
    });
});

// GET /api/v1/dashboard/daily[cite: 4]
// Returns today's active tasks, time spent, completed and pending counts[cite: 4]
export const getDailySummary = asyncHandler(async (req, res) => {
    const summary = await dashboardService.getDailySummary(req.user.id);

    return sendSuccess(res, {
        message: 'Daily productivity summary retrieved successfully.',
        data: { summary },
    });
});

// GET /api/v1/dashboard/activity-matrix[cite: 3, 5, 6]
// Returns year-scoped daily contributions, streak counts, and intensity blocks[cite: 5, 6]
export const getActivityMatrix = asyncHandler(async (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const matrix = await dashboardService.getActivityMatrix(req.user.id, year);

    return sendSuccess(res, {
        message: 'Activity matrix retrieved successfully.',
        data: matrix,
    });
});

// GET /api/v1/dashboard/overview[cite: 3]
// Returns status and priority breakdown for charts and graphs[cite: 3]
export const getTaskOverview = asyncHandler(async (req, res) => {
    const overview = await dashboardService.getTaskOverview(req.user.id);

    return sendSuccess(res, {
        message: 'Task overview breakdown retrieved successfully.',
        data: overview,
    });
});