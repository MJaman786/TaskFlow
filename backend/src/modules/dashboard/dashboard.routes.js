// ─── Dashboard Route Pipeline ───────────────────────────────────────────
// Mounts all analytics and dashboard endpoints. All routes require JWT auth.

import { Router } from 'express';
import * as dashboardController from './dashboard.controller.js';
import protect from '../../middlewares/auth.middleware.js';

const router = Router();

// Apply authentication middleware to all dashboard endpoints
router.use(protect);

// 1. Consolidated Dashboard (Fetches full overview, daily metrics, and activity matrix)
router.get('/', dashboardController.getDashboard);

// 2. Daily Productivity Summary endpoint[cite: 4]
router.get('/daily', dashboardController.getDailySummary);

// 3. Annual Activity Matrix & Streak Calculation endpoint[cite: 3, 5, 6]
router.get('/activity-matrix', dashboardController.getActivityMatrix);

// 4. Task Status & Priority Breakdown (Donut charts)[cite: 3]
router.get('/overview', dashboardController.getTaskOverview);

export default router;