// ─── Joi Request Body Validation Middleware ─────────────────────────────
// Validates incoming HTTP request body against a specified Joi schema.
// Returns a clean 400 Bad Request error if validation rules fail.

import AppError from '../common/AppError.js';

/**
 * Express middleware that validates req.body against a Joi schema.
 * 
 * Options applied:
 * - abortEarly: false   -> Collects and returns ALL validation errors, not just the first one.
 * - stripUnknown: true  -> Automatically removes fields not defined in the schema for cleanliness.
 * 
 * Example Usage:
 *   router.post('/register', validate(registerSchema), authController.register);
 */
const validate = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });

    // If validation fails, compile error details into a clear message
    if (error) {
        const errorMessages = error.details
            .map((detail) => detail.message.replace(/['"]/g, ''))
            .join('; ');

        return next(new AppError(`Validation failed: ${errorMessages}`, 400));
    }

    // Replace req.body with the sanitized and typed value from Joi
    req.body = value;
    next();
};

export default validate;