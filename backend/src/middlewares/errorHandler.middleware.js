// ─── Global Centralized Error Handling Middleware ───────────────────────
import AppError from '../common/AppError.js';
import { sendError } from '../common/response.js';

const errorHandler = (err, req, res, next) => {
    // Handle JWT Expiry Error
    if (err.name === 'TokenExpiredError') {
        return sendError(res, {
            statusCode: 401,
            message: 'Your authentication token has expired. Please log in again.',
        });
    }

    // Handle Malformed / Invalid JWT Error
    if (err.name === 'JsonWebTokenError') {
        return sendError(res, {
            statusCode: 401,
            message: 'Invalid authorization token.',
        });
    }

    // Handle Operational App Errors
    if (err instanceof AppError) {
        return sendError(res, {
            statusCode: err.statusCode,
            message: err.message,
        });
    }

    // Handle PostgreSQL Duplicate Key Errors (Error code 23505)
    if (err.code === '23505') {
        return sendError(res, {
            statusCode: 409,
            message: 'A record with this unique value already exists.',
        });
    }

    // Unhandled / Internal Server Errors
    console.error('💥 Unhandled Internal Error:', err);
    return sendError(res, {
        statusCode: 500,
        message: err.message || 'Internal server error occurred.',
    });
};

export default errorHandler;