// ─── Admin Route Pipeline ───────────────────────────────────────────────
// Mounts all admin oversight endpoints.
// Protected by JWT authentication and restricted strictly to 'ADMIN' role.

import { Router } from 'express';
import Joi from 'joi';
import * as adminController from './admin.controller.js';
import protect from '../../middlewares/auth.middleware.js';
import restrictTo from '../../middlewares/roles.middleware.js';
import validate from '../../middlewares/validate.middleware.js';
import { USER_STATUS } from '../../common/constants.js';

const router = Router();

// ─── Enforce Admin-Only Authorization ───────────────────────────────────
// All endpoints in this router require a valid JWT and an ADMIN role
router.use(protect, restrictTo('ADMIN'));

// Validation schema for updating user status
const statusUpdateSchema = Joi.object({
    status: Joi.string()
        .valid(USER_STATUS.ACTIVE, USER_STATUS.SUSPENDED)
        .required()
        .messages({
            'any.only': 'Status must be either ACTIVE or SUSPENDED',
            'any.required': 'Status is required',
        }),
});

// 1. Get platform-wide overview statistics
router.get('/stats', adminController.getPlatformStats);

// 2. List all users (supports pagination, search, and status filter)
router.get('/users', adminController.listUsers);

// 3. Get single user details by ID
router.get('/users/:id', adminController.getUserById);

// 4. Update user account status (ACTIVE vs SUSPENDED)
router.patch('/users/:id/status', validate(statusUpdateSchema), adminController.setUserStatus);

// 5. Delete user account permanently (cascades tasks & sends confirmation email)
router.delete('/users/:id', adminController.deleteUser);

export default router;