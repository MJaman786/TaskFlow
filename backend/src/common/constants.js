// ─── Application Constants ──────────────────────────────────────────────
// Centralized enumerations and role definitions used across modules.

export const ROLES = {
    USER: 'USER',
    ADMIN: 'ADMIN',
};

export const USER_STATUS = {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
};

export const TASK_STATUS = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    COMPLETED: 'COMPLETED',
};

export const TASK_PRIORITY = {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
};

export const OTP_TYPES = {
    EMAIL_VERIFICATION: 'EMAIL_VERIFICATION',
    PASSWORD_RESET: 'PASSWORD_RESET',
};