// ─── Admin Controller Layer ─────────────────────────────────────────────
// Handles HTTP request lifecycle for Admin management endpoints.

import asyncHandler from '../../common/asyncHandler.js';
import { sendSuccess } from '../../common/response.js';
import adminService from './admin.service.js';

// GET /api/v1/admin/users
// Lists all registered platform users with filters & pagination
export const listUsers = asyncHandler(async (req, res) => {
    const { page, limit, search, status } = req.query;
    const { users, pagination } = await adminService.listUsers({ page, limit, search, status });

    return sendSuccess(res, {
        message: 'Users retrieved successfully.',
        data: { users },
        pagination,
    });
});

// GET /api/v1/admin/users/:id
// Get comprehensive user profile and metrics
export const getUserById = asyncHandler(async (req, res) => {
    const user = await adminService.getUserById(req.params.id);

    return sendSuccess(res, {
        message: 'User details retrieved successfully.',
        data: { user },
    });
});

// PATCH /api/v1/admin/users/:id/status
// Set account status (ACTIVE or SUSPENDED)
export const setUserStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const updatedUser = await adminService.setUserStatus(req.params.id, req.user.id, status);

    return sendSuccess(res, {
        message: `User status successfully updated to ${status}.`,
        data: { user: updatedUser },
    });
});

// DELETE /api/v1/admin/users/:id
// Permanently delete a user account and send confirmation email
export const deleteUser = asyncHandler(async (req, res) => {
    const deletedUser = await adminService.deleteUser(req.params.id, req.user.id);

    return sendSuccess(res, {
        message: `User ${deletedUser.email} and all associated records have been permanently deleted.`,
        data: { user: deletedUser },
    });
});

// GET /api/v1/admin/stats
// Platform-wide overview metrics
export const getPlatformStats = asyncHandler(async (req, res) => {
    const stats = await adminService.getPlatformStats();

    return sendSuccess(res, {
        message: 'Platform statistics retrieved successfully.',
        data: { stats },
    });
});