// ─── AUTHENTICATION ENDPOINTS ──────────────────────────────────────────
export const AUTH_BASE           = '/auth';
export const REGISTER            = `${AUTH_BASE}/register`;
export const RESEND_VERIFICATION = `${AUTH_BASE}/resend-verification`;
export const VERIFY_EMAIL        = `${AUTH_BASE}/verify-email`;
export const LOGIN               = `${AUTH_BASE}/login`;
export const REFRESH             = `${AUTH_BASE}/refresh`;
export const LOGOUT              = `${AUTH_BASE}/logout`;
export const GET_ME              = `${AUTH_BASE}/me`;
export const FORGOT_PASSWORD     = `${AUTH_BASE}/forgot-password`;
export const RESET_PASSWORD      = `${AUTH_BASE}/reset-password`;
export const CHANGE_PASSWORD     = `${AUTH_BASE}/change-password`;
export const UPDATE_PROFILE      = `${AUTH_BASE}/profile`;

// ─── TASK MANAGEMENT ENDPOINTS ─────────────────────────────────────────
export const TASKS_BASE          = '/tasks';
export const TASKS               = `${TASKS_BASE}`;
export const TASK_BY_ID          = (id: string) => `${TASKS_BASE}/${id}`;
export const TASK_AI_SUGGEST     = `${TASKS_BASE}/ai-suggest`;

// ─── REAL-TIME TIME TRACKING ENDPOINTS ─────────────────────────────────
export const TIME_LOGS_BASE      = '/time-logs';
export const TIME_LOGS           = `${TIME_LOGS_BASE}`;
export const TIME_LOG_ACTIVE     = `${TIME_LOGS_BASE}/active`;
export const TIME_LOG_START      = `${TIME_LOGS_BASE}/start`;
export const TIME_LOG_STOP       = `${TIME_LOGS_BASE}/stop`;
export const TIME_LOG_MANUAL     = `${TIME_LOGS_BASE}/manual`;
export const TIME_LOG_BY_ID      = (id: string) => `${TIME_LOGS_BASE}/${id}`;

// ─── DASHBOARD & ANALYTICS ENDPOINTS ───────────────────────────────────
export const DASHBOARD_BASE      = '/dashboard';
export const DASHBOARD           = `${DASHBOARD_BASE}`;
export const DASHBOARD_DAILY     = `${DASHBOARD_BASE}/daily`;
export const DASHBOARD_MATRIX    = `${DASHBOARD_BASE}/activity-matrix`;
export const DASHBOARD_OVERVIEW  = `${DASHBOARD_BASE}/overview`;

// ─── ADMIN ENDPOINTS (ADMIN ROLE ONLY) ─────────────────────────────────
export const ADMIN_BASE          = '/admin';
export const ADMIN_STATS         = `${ADMIN_BASE}/stats`;
export const ADMIN_USERS         = `${ADMIN_BASE}/users`;
export const ADMIN_USER_BY_ID    = (id: string) => `${ADMIN_BASE}/users/${id}`;
export const ADMIN_USER_STATUS   = (id: string) => `${ADMIN_BASE}/users/${id}/status`;