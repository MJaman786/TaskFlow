// ─── PostgreSQL Database Connection Pool ─────────────────────────────────
// Configured for Neon PostgreSQL with SSL support and pooled queries.
import pg from 'pg';
import envConfig from './env.config.js';

const { Pool } = pg;

// Establish PostgreSQL connection pool using connection string
export const pgPool = new Pool({
    connectionString: envConfig.databaseUrl,
    ssl: {
        rejectUnauthorized: false, // Required for Neon cloud PostgreSQL instances
    },
    max: 20,                       // Max concurrent clients in the pool
    idleTimeoutMillis: 30000,      // Close idle clients after 30 seconds
    connectionTimeoutMillis: 5000, // Error after 5 seconds if connection fails
});

// Pool error handling to prevent server crashes on unexpected client errors
pgPool.on('error', (err) => {
    console.error('❌ Unexpected PostgreSQL pool client error:', err.message);
});

// Helper function to test initial database connectivity on startup
export const connectPostgres = async () => {
    if (!envConfig.databaseUrl) {
        throw new Error('DATABASE_URL is not defined in your environment variables.');
    }

    const client = await pgPool.connect();
    try {
        const result = await client.query('SELECT current_database(), NOW()');
        console.log(`✅ PostgreSQL Connected to database: "${result.rows[0].current_database}"`);
    } finally {
        // Release client back to the pool
        client.release();
    }
};

export default pgPool;