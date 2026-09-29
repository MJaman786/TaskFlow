// ─── Swagger OpenAPI 3.0 Documentation ───────────────────────────────────
// Production-grade OpenAPI specification for all TaskFlow backend routes.

const swaggerDocument = {
    openapi: '3.0.3',
    info: {
        title: 'TaskFlow - Task & Time Tracking API',
        version: '1.0.0',
        description: `
## TaskFlow API Gateway & Tracking Engine
A multi-tier platform backend supporting:
- **Authentication**: Email OTP verification, login, JWT refresh rotation, password recovery.
- **Task Management**: User-scoped CRUD operations with intelligent Natural Language (NLP) task suggestion.
- **Real-Time Time Tracking**: Live start/stop stopwatch session recording with single-running-timer enforcement.
- **Dashboard & Analytics**: Daily productivity metrics, consecutive streak counters, and an Annual Activity Heatmap Matrix.
- **Admin Oversight**: Comprehensive user management, status suspension, and permanent deletion with cascade safety.
        `,
    },
    servers: [
        {
            url: 'http://localhost:9000/api/v1',
            description: 'Local Development Server',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Enter your access token obtained from /auth/login or /auth/refresh',
            },
        },
        schemas: {
            // ─── Generic Response Schemas ───────────────────────────────
            ApiSuccess: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    statusCode: { type: 'integer', example: 200 },
                    message: { type: 'string', example: 'Request completed successfully.' },
                    timestamp: { type: 'string', format: 'date-time' },
                    data: { type: 'object', nullable: true },
                },
            },
            ApiError: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    statusCode: { type: 'integer', example: 400 },
                    message: { type: 'string', example: 'Validation failed or resource not found.' },
                    timestamp: { type: 'string', format: 'date-time' },
                    data: { type: 'object', nullable: true },
                },
            },
            PaginationMeta: {
                type: 'object',
                properties: {
                    page: { type: 'integer', example: 1 },
                    limit: { type: 'integer', example: 20 },
                    total: { type: 'integer', example: 50 },
                    totalPages: { type: 'integer', example: 3 },
                },
            },

            // ─── Authentication Schemas ─────────────────────────────────
            RegisterRequest: {
                type: 'object',
                required: ['name', 'email', 'password', 'confirmPassword'],
                properties: {
                    name: { type: 'string', minLength: 2, example: 'Aman Mujawar' },
                    email: { type: 'string', format: 'email', example: 'aman@example.com' },
                    password: { type: 'string', minLength: 6, example: 'Password@123' },
                    confirmPassword: { type: 'string', example: 'Password@123' },
                    role: { type: 'string', enum: ['USER', 'ADMIN'], default: 'USER', example: 'USER' },
                },
            },
            LoginRequest: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                    email: { type: 'string', format: 'email', example: 'user@taskflow.com' },
                    password: { type: 'string', example: 'User@1234' },
                },
            },
            VerifyEmailRequest: {
                type: 'object',
                required: ['email', 'otp'],
                properties: {
                    email: { type: 'string', format: 'email', example: 'user@taskflow.com' },
                    otp: { type: 'string', minLength: 6, maxLength: 6, example: '123456' },
                },
            },
            ResendVerificationRequest: {
                type: 'object',
                required: ['email'],
                properties: {
                    email: { type: 'string', format: 'email', example: 'user@taskflow.com' },
                },
            },
            ForgotPasswordRequest: {
                type: 'object',
                required: ['email'],
                properties: {
                    email: { type: 'string', format: 'email', example: 'user@taskflow.com' },
                },
            },
            ResetPasswordRequest: {
                type: 'object',
                required: ['email', 'otp', 'password', 'confirmPassword'],
                properties: {
                    email: { type: 'string', format: 'email', example: 'user@taskflow.com' },
                    otp: { type: 'string', minLength: 6, maxLength: 6, example: '123456' },
                    password: { type: 'string', minLength: 6, example: 'NewSecret@123' },
                    confirmPassword: { type: 'string', example: 'NewSecret@123' },
                },
            },
            ChangePasswordRequest: {
                type: 'object',
                required: ['currentPassword', 'newPassword', 'confirmPassword'],
                properties: {
                    currentPassword: { type: 'string', example: 'User@1234' },
                    newPassword: { type: 'string', minLength: 6, example: 'UpdatedSecret@123' },
                    confirmPassword: { type: 'string', example: 'UpdatedSecret@123' },
                },
            },
            UpdateProfileRequest: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Aman Mujawar' },
                    avatar: { type: 'string', format: 'uri', example: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' },
                },
            },

            // ─── Task Schemas ───────────────────────────────────────────
            CreateTaskRequest: {
                type: 'object',
                required: ['title'],
                properties: {
                    title: { type: 'string', minLength: 2, maxLength: 250, example: 'Follow up with UI Designer' },
                    description: { type: 'string', example: 'Send a Slack message to confirm wireframe delivery status.' },
                    status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'], default: 'PENDING' },
                    priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
                    dueDate: { type: 'string', format: 'date-time', nullable: true, example: '2026-10-15T18:00:00.000Z' },
                },
            },
            UpdateTaskRequest: {
                type: 'object',
                properties: {
                    title: { type: 'string', minLength: 2, maxLength: 250, example: 'Follow up with Senior UI Designer' },
                    description: { type: 'string', example: 'Updated notes from morning standup.' },
                    status: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'] },
                    priority: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
                    dueDate: { type: 'string', format: 'date-time', nullable: true },
                },
            },
            NlpSuggestRequest: {
                type: 'object',
                required: ['input'],
                properties: {
                    input: { type: 'string', example: 'follow up with designer regarding wireframes asap' },
                },
            },

            // ─── Time Tracking Schemas ──────────────────────────────────
            StartTimerRequest: {
                type: 'object',
                required: ['taskId'],
                properties: {
                    taskId: { type: 'string', format: 'uuid', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
                },
            },
            StopTimerRequest: {
                type: 'object',
                properties: {
                    logId: { type: 'string', format: 'uuid', nullable: true, description: 'Optional. Auto-detects user active session if omitted.' },
                },
            },
            ManualLogRequest: {
                type: 'object',
                required: ['taskId', 'startTime', 'endTime'],
                properties: {
                    taskId: { type: 'string', format: 'uuid', example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' },
                    startTime: { type: 'string', format: 'date-time', example: '2026-09-29T10:00:00.000Z' },
                    endTime: { type: 'string', format: 'date-time', example: '2026-09-29T11:30:00.000Z' },
                },
            },

            // ─── Admin Schemas ──────────────────────────────────────────
            UpdateUserStatusRequest: {
                type: 'object',
                required: ['status'],
                properties: {
                    status: { type: 'string', enum: ['ACTIVE', 'SUSPENDED'], example: 'SUSPENDED' },
                },
            },
        },
    },
    tags: [
        { name: 'Authentication', description: 'Registration, OTP verification, sessions, and credentials' },
        { name: 'Tasks', description: 'Task lifecycle management & Natural Language generation' },
        { name: 'Time Tracking', description: 'Live start/stop stopwatch and log management' },
        { name: 'Dashboard & Analytics', description: 'Daily summaries, streak metrics, and annual activity heatmaps' },
        { name: 'Admin', description: 'Platform oversight and user management (ADMIN role required)' },
    ],
    paths: {
        // ─── AUTHENTICATION ENDPOINTS ───────────────────────────────────
        '/auth/register': {
            post: {
                tags: ['Authentication'],
                summary: 'Register a new user account',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } },
                },
                responses: {
                    201: { description: 'Registration successful. 6-digit OTP dispatched to email.' },
                    409: { description: 'Email already registered.' },
                },
            },
        },
        '/auth/resend-verification': {
            post: {
                tags: ['Authentication'],
                summary: 'Resend email verification code',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ResendVerificationRequest' } } },
                },
                responses: {
                    200: { description: 'Code re-sent if account exists and is unverified.' },
                    429: { description: 'Rate limited. Must wait 60 seconds.' },
                },
            },
        },
        '/auth/verify-email': {
            post: {
                tags: ['Authentication'],
                summary: 'Verify account using 6-digit email OTP',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/VerifyEmailRequest' } } },
                },
                responses: {
                    200: { description: 'Email verified. Account is now active.' },
                    400: { description: 'Invalid or expired OTP code.' },
                },
            },
        },
        '/auth/login': {
            post: {
                tags: ['Authentication'],
                summary: 'Log in and obtain access token',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } },
                },
                responses: {
                    200: { description: 'Login successful. Returns access token and sets refresh cookie.' },
                    401: { description: 'Invalid email or password.' },
                    403: { description: 'Email unverified or account suspended.' },
                },
            },
        },
        '/auth/refresh': {
            post: {
                tags: ['Authentication'],
                summary: 'Rotate session tokens',
                responses: {
                    200: { description: 'Session refreshed. Returns new access token.' },
                    401: { description: 'Refresh token invalid, expired, or reused.' },
                },
            },
        },
        '/auth/forgot-password': {
            post: {
                tags: ['Authentication'],
                summary: 'Request password reset recovery OTP',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ForgotPasswordRequest' } } },
                },
                responses: {
                    200: { description: 'Recovery code dispatched if email is registered.' },
                },
            },
        },
        '/auth/reset-password': {
            post: {
                tags: ['Authentication'],
                summary: 'Reset password using recovery code',
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ResetPasswordRequest' } } },
                },
                responses: {
                    200: { description: 'Password reset successfully.' },
                    400: { description: 'Invalid recovery OTP.' },
                },
            },
        },
        '/auth/me': {
            get: {
                tags: ['Authentication'],
                summary: 'Get authenticated user profile context',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'User context retrieved.' },
                    401: { description: 'Unauthorized.' },
                },
            },
        },
        '/auth/profile': {
            patch: {
                tags: ['Authentication'],
                summary: 'Update user profile details',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProfileRequest' } } },
                },
                responses: {
                    200: { description: 'Profile updated.' },
                    401: { description: 'Unauthorized.' },
                },
            },
        },
        '/auth/change-password': {
            patch: {
                tags: ['Authentication'],
                summary: 'Change password (terminates all other active sessions)',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ChangePasswordRequest' } } },
                },
                responses: {
                    200: { description: 'Password changed successfully.' },
                    400: { description: 'Current password incorrect.' },
                },
            },
        },
        '/auth/logout': {
            post: {
                tags: ['Authentication'],
                summary: 'Log out and invalidate current session',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'Logged out.' },
                },
            },
        },

        // ─── TASK ENDPOINTS ─────────────────────────────────────────────
        '/tasks': {
            get: {
                tags: ['Tasks'],
                summary: 'List user tasks with filters & pagination',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
                    { name: 'status', in: 'query', schema: { type: 'string', enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'] } },
                    { name: 'priority', in: 'query', schema: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] } },
                    { name: 'search', in: 'query', schema: { type: 'string' } },
                ],
                responses: {
                    200: { description: 'Tasks list retrieved.' },
                },
            },
            post: {
                tags: ['Tasks'],
                summary: 'Create a new task',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTaskRequest' } } },
                },
                responses: {
                    201: { description: 'Task created.' },
                },
            },
        },
        '/tasks/ai-suggest': {
            post: {
                tags: ['Tasks'],
                summary: 'Natural Language Assistant: Convert rough input into structured task',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/NlpSuggestRequest' } } },
                },
                responses: {
                    200: { description: 'Suggestion generated.' },
                },
            },
        },
        '/tasks/{id}': {
            get: {
                tags: ['Tasks'],
                summary: 'Get task details by ID',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: {
                    200: { description: 'Task retrieved.' },
                    404: { description: 'Task not found.' },
                },
            },
            patch: {
                tags: ['Tasks'],
                summary: 'Update task details or status',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateTaskRequest' } } },
                },
                responses: {
                    200: { description: 'Task updated.' },
                    404: { description: 'Task not found.' },
                },
            },
            delete: {
                tags: ['Tasks'],
                summary: 'Permanently delete task and associated logs',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: {
                    200: { description: 'Task deleted.' },
                },
            },
        },

        // ─── TIME TRACKING ENDPOINTS ────────────────────────────────────
        '/time-logs/active': {
            get: {
                tags: ['Time Tracking'],
                summary: 'Get current active running timer session',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'Active timer retrieved or null.' },
                },
            },
        },
        '/time-logs/start': {
            post: {
                tags: ['Time Tracking'],
                summary: 'Start stopwatch timer on a task',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/StartTimerRequest' } } },
                },
                responses: {
                    201: { description: 'Timer started.' },
                    400: { description: 'Another timer is already running.' },
                },
            },
        },
        '/time-logs/stop': {
            post: {
                tags: ['Time Tracking'],
                summary: 'Stop running timer and record elapsed seconds',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: false,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/StopTimerRequest' } } },
                },
                responses: {
                    200: { description: 'Timer stopped and duration logged.' },
                    400: { description: 'No timer was actively running.' },
                },
            },
        },
        '/time-logs/manual': {
            post: {
                tags: ['Time Tracking'],
                summary: 'Log a past manual time tracking block',
                security: [{ bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/ManualLogRequest' } } },
                },
                responses: {
                    201: { description: 'Manual time logged.' },
                },
            },
        },
        '/time-logs': {
            get: {
                tags: ['Time Tracking'],
                summary: 'List time logs with pagination and date filters',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 30 } },
                    { name: 'taskId', in: 'query', schema: { type: 'string', format: 'uuid' } },
                    { name: 'from', in: 'query', schema: { type: 'string', format: 'date-time' } },
                    { name: 'to', in: 'query', schema: { type: 'string', format: 'date-time' } },
                ],
                responses: {
                    200: { description: 'Time logs retrieved.' },
                },
            },
        },
        '/time-logs/{id}': {
            delete: {
                tags: ['Time Tracking'],
                summary: 'Delete a time log entry',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: {
                    200: { description: 'Time log deleted.' },
                },
            },
        },

        // ─── DASHBOARD & ANALYTICS ENDPOINTS ────────────────────────────
        '/dashboard': {
            get: {
                tags: ['Dashboard & Analytics'],
                summary: 'Consolidated dashboard feed (all modules)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'year', in: 'query', schema: { type: 'integer', default: 2026 } }],
                responses: {
                    200: { description: 'Consolidated dashboard retrieved.' },
                },
            },
        },
        '/dashboard/daily': {
            get: {
                tags: ['Dashboard & Analytics'],
                summary: "Daily summary (today's active tasks, seconds, and status breakdown)",
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'Daily productivity snapshot.' },
                },
            },
        },
        '/dashboard/activity-matrix': {
            get: {
                tags: ['Dashboard & Analytics'],
                summary: 'Annual activity matrix heatmap & consecutive streak calculation',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'year', in: 'query', schema: { type: 'integer', default: 2026 } }],
                responses: {
                    200: { description: 'Annual matrix and streak records.' },
                },
            },
        },
        '/dashboard/overview': {
            get: {
                tags: ['Dashboard & Analytics'],
                summary: 'Task status and priority distribution overview (donut charts)',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'Overview breakdown.' },
                },
            },
        },

        // ─── ADMIN ENDPOINTS ────────────────────────────────────────────
        '/admin/stats': {
            get: {
                tags: ['Admin'],
                summary: 'Platform-wide overview metrics',
                security: [{ bearerAuth: [] }],
                responses: {
                    200: { description: 'System stats retrieved.' },
                    403: { description: 'Admin role required.' },
                },
            },
        },
        '/admin/users': {
            get: {
                tags: ['Admin'],
                summary: 'List all registered platform users with filters and task counts',
                security: [{ bearerAuth: [] }],
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
                    { name: 'search', in: 'query', schema: { type: 'string' } },
                    { name: 'status', in: 'query', schema: { type: 'string', enum: ['ACTIVE', 'SUSPENDED'] } },
                ],
                responses: {
                    200: { description: 'Users list retrieved.' },
                    403: { description: 'Admin role required.' },
                },
            },
        },
        '/admin/users/{id}': {
            get: {
                tags: ['Admin'],
                summary: 'Get single user profile and aggregated metrics',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: {
                    200: { description: 'User retrieved.' },
                    404: { description: 'User not found.' },
                },
            },
            delete: {
                tags: ['Admin'],
                summary: 'Permanently delete user account and dispatch deletion notification email',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: {
                    200: { description: 'User and all associated data permanently deleted.' },
                    400: { description: 'Admins cannot delete their own account.' },
                },
            },
        },
        '/admin/users/{id}/status': {
            patch: {
                tags: ['Admin'],
                summary: 'Update user account status (ACTIVE vs SUSPENDED)',
                security: [{ bearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                requestBody: {
                    required: true,
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateUserStatusRequest' } } },
                },
                responses: {
                    200: { description: 'User status updated.' },
                    400: { description: 'Admins cannot suspend their own account.' },
                },
            },
        },
    },
};

export default swaggerDocument;