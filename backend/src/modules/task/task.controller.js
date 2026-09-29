// ─── Task Controller Layer ──────────────────────────────────────────────
// Handles incoming HTTP requests and structures API responses for Task operations.

import asyncHandler from '../../common/asyncHandler.js';
import { sendSuccess } from '../../common/response.js';
import taskService from './task.service.js';

// GET /api/v1/tasks
export const getTasks = asyncHandler(async (req, res) => {
    const { tasks, pagination } = await taskService.listTasks(req.user.id, req.query);
    return sendSuccess(res, {
        message: 'Tasks retrieved successfully.',
        data: { tasks },
        pagination,
    });
});

// GET /api/v1/tasks/:id
export const getTaskById = asyncHandler(async (req, res) => {
    const task = await taskService.getTaskById(req.params.id, req.user.id);
    return sendSuccess(res, {
        message: 'Task retrieved successfully.',
        data: { task },
    });
});

// POST /api/v1/tasks
export const createTask = asyncHandler(async (req, res) => {
    const task = await taskService.createTask(req.user.id, req.body);
    return sendSuccess(res, {
        statusCode: 201,
        message: 'Task created successfully.',
        data: { task },
    });
});

// PATCH /api/v1/tasks/:id
export const updateTask = asyncHandler(async (req, res) => {
    const task = await taskService.updateTask(req.params.id, req.user.id, req.body);
    return sendSuccess(res, {
        message: 'Task updated successfully.',
        data: { task },
    });
});

// DELETE /api/v1/tasks/:id
export const deleteTask = asyncHandler(async (req, res) => {
    await taskService.deleteTask(req.params.id, req.user.id);
    return sendSuccess(res, {
        message: 'Task and all associated time records deleted successfully.',
        data: null,
    });
});

// POST /api/v1/tasks/ai-suggest
// Natural language assistant endpoint for auto-generating structured tasks[cite: 4]
export const suggestTaskFromNLP = asyncHandler(async (req, res) => {
    const suggestion = taskService.parseNaturalLanguageTask(req.body.input);
    return sendSuccess(res, {
        message: 'Structured task suggestion generated successfully.',
        data: suggestion,
    });
});