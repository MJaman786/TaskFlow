// ─── Task Service Layer ─────────────────────────────────────────────────
// Contains core logic for tasks and natural language suggestion heuristics.

import { TaskModel } from './task.model.js';
import AppError from '../../common/AppError.js';
import { TASK_PRIORITY } from '../../common/constants.js';

/**
 * 1. Get all tasks for an authenticated user with pagination and filters
 */
export const listTasks = async (userId, query) => {
    const page = parseInt(query.page, 10) || 1;
    const limit = parseInt(query.limit, 10) || 20;
    const offset = (page - 1) * limit;

    const { tasks, total } = await TaskModel.findAllByUser(userId, {
        status: query.status,
        priority: query.priority,
        search: query.search,
        limit,
        offset,
    });

    return {
        tasks,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit) || 1,
        },
    };
};

/**
 * 2. Get a single task by ID
 */
export const getTaskById = async (taskId, userId) => {
    const task = await TaskModel.findByIdAndUser(taskId, userId);
    if (!task) {
        throw new AppError('Task not found or access denied.', 404);
    }
    return task;
};

/**
 * 3. Create a new task
 */
export const createTask = async (userId, taskData) => {
    return await TaskModel.create({
        userId,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        dueDate: taskData.dueDate,
    });
};

/**
 * 4. Update an existing task
 */
export const updateTask = async (taskId, userId, updateData) => {
    // Verify task exists and is owned by this user first
    const existingTask = await TaskModel.findByIdAndUser(taskId, userId);
    if (!existingTask) {
        throw new AppError('Task not found or access denied.', 404);
    }

    const updatedTask = await TaskModel.update(taskId, userId, updateData);
    return updatedTask;
};

/**
 * 5. Delete a task
 */
export const deleteTask = async (taskId, userId) => {
    const deletedTask = await TaskModel.delete(taskId, userId);
    if (!deletedTask) {
        throw new AppError('Task not found or access denied.', 404);
    }
    return deletedTask;
};

/**
 * 6. Natural Language Task Assistant (Auto-Generate Title & Structured Description)
 * Transforms rough prompts (e.g. "follow up with designer") into clean,
 * structured titles and descriptive action items as requested in the assignment[cite: 4].
 */
export const parseNaturalLanguageTask = (rawInput) => {
    const cleaned = rawInput.trim();
    const lower = cleaned.toLowerCase();

    // Determine task priority based on urgency cues in the prompt
    let suggestedPriority = TASK_PRIORITY.MEDIUM;
    if (lower.includes('urgent') || lower.includes('asap') || lower.includes('critical') || lower.includes('immediately')) {
        suggestedPriority = TASK_PRIORITY.HIGH;
    } else if (lower.includes('someday') || lower.includes('low') || lower.includes('eventually') || lower.includes('when free')) {
        suggestedPriority = TASK_PRIORITY.LOW;
    }

    // Capitalize first letters helper
    const titleCase = (str) =>
        str
            .split(' ')
            .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ''))
            .join(' ');

    let suggestedTitle = '';
    let suggestedDescription = '';

    // Smart contextual patterns
    if (lower.startsWith('follow up with') || lower.startsWith('followup with')) {
        const personOrTeam = cleaned.replace(/follow\s*up with/i, '').trim();
        suggestedTitle = `Follow up with ${titleCase(personOrTeam)}`;
        suggestedDescription = `Reach out via Slack, email, or direct meeting to check on progress, deliverables, and outstanding dependencies.`;
    } else if (lower.startsWith('call') || lower.startsWith('sync with') || lower.startsWith('meet with')) {
        const subject = cleaned.replace(/^(call|sync with|meet with)\s+/i, '').trim();
        suggestedTitle = `Meeting: ${titleCase(subject)}`;
        suggestedDescription = `Coordinate a scheduled sync to align on action items, timelines, and next operational steps.`;
    } else if (lower.startsWith('fix') || lower.startsWith('bug') || lower.startsWith('resolve')) {
        const issue = cleaned.replace(/^(fix|bug|resolve)\s+/i, '').trim();
        suggestedTitle = `Fix: ${titleCase(issue)}`;
        suggestedDescription = `Investigate root cause, write reproducible test cases, implement bug patch, and verify stability.`;
    } else if (lower.startsWith('review') || lower.startsWith('check')) {
        const item = cleaned.replace(/^(review|check)\s+/i, '').trim();
        suggestedTitle = `Review: ${titleCase(item)}`;
        suggestedDescription = `Perform a thorough audit of the code, document, or specs. Share feedback and approve changes.`;
    } else if (lower.startsWith('write') || lower.startsWith('document') || lower.startsWith('draft')) {
        const doc = cleaned.replace(/^(write|document|draft)\s+/i, '').trim();
        suggestedTitle = `Document: ${titleCase(doc)}`;
        suggestedDescription = `Draft comprehensive documentation, outline key architectural decisions, and publish for the team.`;
    } else {
        // Fallback: Clean sentence formatting
        suggestedTitle = titleCase(cleaned);
        suggestedDescription = `Complete the following task: "${cleaned}". Ensure all acceptance criteria are met and logs are updated.`;
    }

    return {
        rawInput: cleaned,
        suggestedTitle,
        suggestedDescription,
        suggestedPriority,
    };
};

export default {
    listTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    parseNaturalLanguageTask,
};