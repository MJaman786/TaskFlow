// ─── Custom Application Error Class ─────────────────────────────────────
// Extends built-in Error to attach HTTP status codes and operational flags.
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);

        this.statusCode = statusCode;
        this.success = false;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;