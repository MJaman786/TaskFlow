// ─── Express Application Setup & Route Integration ──────────────────────
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import envConfig from './config/env.config.js';
import swaggerDocument from './docs/swagger.js';
import notFoundHandler from './middlewares/notFound.middleware.js';
import errorHandler from './middlewares/errorHandler.middleware.js';

// ─── Module Route Imports ───────────────────────────────────────────────
import authRoutes from './modules/auth/auth.routes.js';
import taskRoutes from './modules/task/task.routes.js';
import timetrackRoutes from './modules/timetrack/timetrack.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();

// ─── Global Middlewares ─────────────────────────────────────────────────
// Cross-Origin Resource Sharing (CORS) Configuration
app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g., Postman, mobile apps, curl)
            if (!origin) return callback(null, true);

            if (
                envConfig.allowedOrigins.includes(origin) ||
                envConfig.NODE_ENV === 'development'
            ) {
                return callback(null, true);
            }
            return callback(new Error(`CORS policy blocked access from origin: ${origin}`));
        },
        credentials: true, // Allow cookies across origins
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'ngrok-skip-browser-warning'],
    })
);

// Body Parsing Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// HTTP Request Logging
if (envConfig.NODE_ENV !== 'test') {
    app.use(morgan(envConfig.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

// ─── Health Check & Landing Endpoints ───────────────────────────────────
// JSON Health Check Endpoint
app.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running smoothly',
        service: 'TaskFlow Backend API',
        environment: envConfig.NODE_ENV,
        timestamp: new Date().toISOString(),
    });
});

// Root ASCII Test Banner[cite: 1]
app.get('/', (req, res) => {
    res.type('text/plain');
    res.send(`
        ███████╗███████╗██████╗ ██╗   ██╗███████╗██████╗     ██████╗ ██╗   ██╗███╗   ██╗███╗   ██╗██╗███╗   ██╗ ██████╗                 
        ██╔════╝██╔════╝██╔══██╗██║   ██║██╔════╝██╔══██╗    ██╔══██╗██║   ██║████╗  ██║████╗  ██║██║████╗  ██║██╔════╝                 
        ███████╗█████╗  ██████╔╝██║   ██║█████╗  ██████╔╝    ██████╔╝██║   ██║██╔██╗ ██║██╔██╗ ██║██║██╔██╗ ██║██║  ███╗                
        ╚════██║██╔══╝  ██╔══██╗╚██╗ ██╔╝██╔══╝  ██╔══██╗    ██╔══██╗██║   ██║██║╚██╗██║██║╚██╗██║██║██║╚██╗██║██║   ██║                
        ███████║███████╗██║  ██║ ╚████╔╝ ███████╗██║  ██║    ██║  ██║╚██████╔╝██║ ╚████║██║ ╚████║██║██║ ╚████║╚██████╔╝    ██╗██╗██╗██╗
        ╚══════╝╚══════╝╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝    ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚═╝╚═╝  ╚═══╝ ╚═════╝     ╚═╝╚═╝╚═╝╚═╝                                                                                                                            
    `);
});

// ─── Application API Routes Mount Pipeline ──────────────────────────────
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/time-logs', timetrackRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/admin', adminRoutes);

// ─── Swagger Interactive Documentation ──────────────────────────────────
// Persists authorization token across page refreshes for seamless route testing[cite: 1, 2]
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        swaggerOptions: {
            persistAuthorization: true,
        },
        customSiteTitle: 'TaskFlow API Documentation',
    })
);

// ─── Centralized Error Handlers (Always mounted last) ───────────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;