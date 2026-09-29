// ─── Database Migration Runner ──────────────────────────────────────────
// Executes schema.sql directly against your Neon PostgreSQL instance.
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pgPool } from '../config/db.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const runMigrations = async () => {
    try {
        console.log('🔄 Initiating PostgreSQL database migration on Neon...');

        // Read DDL file contents
        const sqlScript = readFileSync(join(__dirname, 'schema.sql'), 'utf8');

        // Execute queries
        await pgPool.query(sqlScript);

        console.log('✅ Migrations executed successfully! All tables, indexes, and triggers are ready.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        process.exit(1);
    } finally {
        await pgPool.end();
    }
};

runMigrations();