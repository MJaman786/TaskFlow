// ─── Task Validation Schemas ────────────────────────────────────────────
// Joi validation schemas for Task creation, updating, NLP parsing, and queries.

import Joi from 'joi';
import { TASK_STATUS, TASK_PRIORITY } from '../../common/constants.js';

// Schema for creating a standard task
export const createTaskSchema = Joi.object({
    title: Joi.string().trim().min(2).max(250).required().messages({
        'string.min': 'Task title must be at least 2 characters long',
        'string.max': 'Task title cannot exceed 250 characters',
        'any.required': 'Task title is required',
    }),
    description: Joi.string().trim().max(2000).allow('').optional().default(''),
    status: Joi.string()
        .valid(TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED)
        .default(TASK_STATUS.PENDING)
        .messages({
            'any.only': 'Status must be one of: PENDING, IN_PROGRESS, COMPLETED',
        }),
    priority: Joi.string()
        .valid(TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH)
        .default(TASK_PRIORITY.MEDIUM)
        .messages({
            'any.only': 'Priority must be one of: LOW, MEDIUM, HIGH',
        }),
    dueDate: Joi.date().iso().allow(null).optional(),
});

// Schema for updating an existing task (all fields optional)
export const updateTaskSchema = Joi.object({
    title: Joi.string().trim().min(2).max(250).optional(),
    description: Joi.string().trim().max(2000).allow('').optional(),
    status: Joi.string()
        .valid(TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED)
        .optional(),
    priority: Joi.string()
        .valid(TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH)
        .optional(),
    dueDate: Joi.date().iso().allow(null).optional(),
}).min(1).messages({
    'object.min': 'Please provide at least one field to update',
});

// Schema for Natural Language Input Suggestion Endpoint
export const nlpTaskSchema = Joi.object({
    input: Joi.string().trim().min(3).max(500).required().messages({
        'string.min': 'Input prompt must be at least 3 characters long',
        'any.required': 'Natural language input text is required (e.g., "follow up with designer")',
    }),
});

// Query string parameters schema for task filtering and pagination
export const taskQuerySchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    status: Joi.string()
        .valid(TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED)
        .optional(),
    priority: Joi.string()
        .valid(TASK_PRIORITY.LOW, TASK_PRIORITY.MEDIUM, TASK_PRIORITY.HIGH)
        .optional(),
    search: Joi.string().trim().allow('').optional(),
});