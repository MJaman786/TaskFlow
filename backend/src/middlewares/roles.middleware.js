// ─── Role-Based Access Control (RBAC) Middleware ────────────────────────
// Restricts route access to specific roles (e.g., 'ADMIN' or 'USER').
// Must be used AFTER the `protect` middleware in the route pipeline.

import AppError from '../common/AppError.js';

/**
 * Higher-order middleware to restrict endpoint access by role.
 * Example Usage:
 *   router.delete('/users/:id', protect, restrictTo('ADMIN'), deleteUser);
 *   router.get('/reports', protect, restrictTo('ADMIN', 'USER'), getReports);
 */
export const restrictTo = (...allowedRoles) => {
    // Flatten array in case an array was passed: restrictTo(['ADMIN'])
    const roles = allowedRoles.flat();

    return (req, res, next) => {
        // 1. Ensure user context was populated by protect middleware
        if (!req.user || !req.user.role) {
            return next(
                new AppError('Unauthorized request. User identity context missing.', 401)
            );
        }

        // 2. Check if the authenticated user's role is permitted
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    `Forbidden. You do not have permission to perform this action. Required role: [${roles.join(', ')}]`,
                    403
                )
            );
        }

        // 3. User has required role, proceed to next handler
        next();
    };
};

export default restrictTo;