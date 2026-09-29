// ─── Task Route Pipeline ────────────────────────────────────────────────
// Mounts all task endpoints. All endpoints are protected by JWT authentication.

import { Router } from 'express';
import * as taskController from './task.controller.js';
import protect from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import {
    createTaskSchema,
    updateTaskSchema,
    nlpTaskSchema,
    taskQuerySchema,
} from './task.validation.js';

const router = Router();

// ─── Apply Authentication to All Task Routes ────────────────────────────
router.use(protect);

// 1. Natural Language Task Assistant (Auto-generate title & description)[cite: 4]
router.post('/ai-suggest', validate(nlpTaskSchema), taskController.suggestTaskFromNLP);

// 2. List all user tasks with pagination & search
router.get('/', validate(taskQuerySchema), taskController.getTasks);

// 3. Create a new task
router.post('/', validate(createTaskSchema), taskController.createTask);

// 4. Get a single task by ID
router.get('/:id', taskController.getTaskById);

// 5. Update task details or toggle status (PENDING -> IN_PROGRESS -> COMPLETED)[cite: 4]
router.patch('/:id', validate(updateTaskSchema), taskController.updateTask);

// 6. Delete a task permanently[cite: 4]
router.delete('/:id', taskController.deleteTask);

export default router;