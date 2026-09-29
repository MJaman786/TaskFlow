// ─── Environment Configuration ──────────────────────────────────────────
// Loads environment variables from .env and exposes a clean config object.
import dotenv from 'dotenv';

// Read variables from local .env
dotenv.config();

const envConfig = {
    PORT: parseInt(process.env.PORT || '9000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',

    // PostgreSQL connection string (supports Neon pooling connections)
    databaseUrl: process.env.DATABASE_URL,

    // JSON Web Token Settings
    jwt: {
        accessSecret: process.env.JWT_SECRET || 'dev_jwt_access_secret_key',
        accessExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
        refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_jwt_refresh_secret_key',
        refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    },

    // Email Credentials for Nodemailer OTP services
    mail: {
        user: process.env.GOOGLE_USER_EMAIL,
        password: process.env.GOOGLE_APP_PASSWORD,
    },

    // Allowed frontend origins for CORS headers
    allowedOrigins: process.env.ALLOWED_ORIGINS
        ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
        : ['http://localhost:5173', 'http://localhost:3000'],
};

export default envConfig;