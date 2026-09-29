// ─── Time Tracking Route Pipeline ───────────────────────────────────────
// Mounts all live timer and log record endpoints. Protected by JWT auth.

import { Router } from 'express';
import * as timetrackController from './timetrack.controller.js';
import protect from '../../middlewares/auth.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import {
    startTimerSchema,
    stopTimerSchema,
    manualLogSchema,
    timeLogQuerySchema,
} from './timetrack.validation.js';

const router = Router();

// Apply authentication to all time tracking endpoints
router.use(protect);

// 1. Get currently active live running timer with elapsed duration[cite: 4]
router.get('/active', timetrackController.getActiveTimer);

// 2. Start stopwatch timer on a task[cite: 4]
router.post('/start', validate(startTimerSchema), timetrackController.startTimer);

// 3. Stop running timer session and record duration[cite: 4]
router.post('/stop', validate(stopTimerSchema), timetrackController.stopTimer);

// 4. Log manual time entry
router.post('/manual', validate(manualLogSchema), timetrackController.logManualTime);

// 5. List all time log sessions with pagination and filters[cite: 4]
router.get('/', validate(timeLogQuerySchema), timetrackController.getTimeLogs);

// 6. Delete a specific time log
router.delete('/:id', timetrackController.deleteTimeLog);

export default router;