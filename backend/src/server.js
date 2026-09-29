// ─── Server Bootstrap & Graceful Shutdown ───────────────────────────────
import app from './app.js';
import envConfig from './config/env.config.js';
import { connectPostgres, pgPool } from './config/db.config.js';

const startServer = async () => {
    try {
        // 1. Verify PostgreSQL connection
        await connectPostgres();

        // 2. Start HTTP server
        const server = app.listen(envConfig.PORT, () => {
            console.log(`\n🚀 Server is actively listening on http://localhost:${envConfig.PORT}`);
            console.log(`📡 Environment: ${envConfig.NODE_ENV}`);
            console.log(`📑 Health endpoint: http://localhost:${envConfig.PORT}/health\n`);
        });

        // 3. Graceful shutdown handler
        const handleShutdown = async (signal) => {
            console.log(`\n⚠️  Received ${signal}. Shutting down gracefully...`);
            server.close(async () => {
                console.log('🛑 HTTP server closed.');
                await pgPool.end();
                console.log('🔒 PostgreSQL pool has been closed cleanly.');
                process.exit(0);
            });
        };

        process.on('SIGTERM', () => handleShutdown('SIGTERM'));
        process.on('SIGINT', () => handleShutdown('SIGINT'));
    } catch (error) {
        console.error('❌ Server failed to start:', error.message);
        process.exit(1);
    }
};

startServer();