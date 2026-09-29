// ─── Time Tracking Validation Schemas ───────────────────────────────────
// Joi validation schemas for timer session controls and queries.

import Joi from 'joi';

// Schema for starting the real-time stopwatch on a task
export const startTimerSchema = Joi.object({
    taskId: Joi.string().uuid().required().messages({
        'string.guid': 'Invalid Task ID format. Must be a valid UUID',
        'any.required': 'Task ID is required to start time tracking',
    }),
});

// Schema for stopping a running timer session (logId is optional, auto-detects active if omitted)
export const stopTimerSchema = Joi.object({
    logId: Joi.string().uuid().optional().messages({
        'string.guid': 'Invalid Log ID format',
    }),
});

// Schema for manually adding a past time tracking block
export const manualLogSchema = Joi.object({
    taskId: Joi.string().uuid().required().messages({
        'string.guid': 'Invalid Task ID format',
        'any.required': 'Task ID is required',
    }),
    startTime: Joi.date().iso().required().messages({
        'any.required': 'Start time is required',
    }),
    endTime: Joi.date().iso().greater(Joi.ref('startTime')).required().messages({
        'date.greater': 'End time must be after start time',
        'any.required': 'End time is required',
    }),
});

// Query parameters schema for filtering logs
export const timeLogQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(30),
    taskId: Joi.string().uuid().optional(),
    from: Joi.date().iso().optional(),
    to: Joi.date().iso().optional(),
});