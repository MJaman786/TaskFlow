// ─── Database Seeder Utility ────────────────────────────────────────────
// Seeds Neon PostgreSQL with verified Admin and User accounts, realistic
// tasks, and historical time tracking logs so the dashboard analytics,
// streaks, and activity matrix display data immediately upon startup.

import bcrypt from 'bcrypt';
import { pgPool } from '../config/db.config.js';

export const seedDatabase = async () => {
    const client = await pgPool.connect();

    try {
        console.log('🔄 Starting database seeding pipeline...');

        // ─── Step 1: Wipe existing records cleanly ──────────────────────
        // Truncate cascades down: users -> otps, sessions, tasks -> time_logs
        await client.query('TRUNCATE TABLE users CASCADE;');
        console.log('🗑️  Existing tables cleared cleanly.');

        // ─── Step 2: Hash passwords using bcrypt (10 rounds) ───────────
        const adminPasswordHash = await bcrypt.hash('Admin@1234', 10);
        const userPasswordHash = await bcrypt.hash('User@1234', 10);

        // ─── Step 3: Insert Users (ADMIN and USER roles) ────────────────
        console.log('👤 Seeding default user accounts...');

        // 1. Admin Account (Manages platform users: view, suspend, delete)
        const adminInsertQuery = `
            INSERT INTO users (
                name, email, password, role, status, is_email_verified, email_verified_at
            ) VALUES (
                'System Admin', 'admin@taskflow.com', $1, 'ADMIN', 'ACTIVE', TRUE, NOW()
            ) RETURNING id, name, email, role;
        `;
        const adminRes = await client.query(adminInsertQuery, [adminPasswordHash]);
        const adminUser = adminRes.rows[0];
        console.log(`   ✅ Seeded [${adminUser.role}] -> ${adminUser.email}`);

        // 2. Main Platform User (Uses tasks, time tracker, and dashboard)
        const userInsertQuery = `
            INSERT INTO users (
                name, email, password, role, status, is_email_verified, email_verified_at
            ) VALUES (
                'Aman Mujawar', 'user@taskflow.com', $1, 'USER', 'ACTIVE', TRUE, NOW()
            ) RETURNING id, name, email, role;
        `;
        const userRes = await client.query(userInsertQuery, [userPasswordHash]);
        const mainUser = userRes.rows[0];
        console.log(`   ✅ Seeded [${mainUser.role}]  -> ${mainUser.email}`);

        // 3. Secondary Demo User (To verify multi-tenant data isolation)
        const secondUserRes = await client.query(
            `INSERT INTO users (
                name, email, password, role, status, is_email_verified, email_verified_at
            ) VALUES (
                'Demo Member', 'demo@taskflow.com', $1, 'USER', 'ACTIVE', TRUE, NOW()
            ) RETURNING id, name, email, role;`,
            [userPasswordHash]
        );
        console.log(`   ✅ Seeded [${secondUserRes.rows[0].role}]  -> ${secondUserRes.rows[0].email}`);

        // ─── Step 4: Seed Tasks for Main User ───────────────────────────
        console.log('📝 Seeding demo tasks for main user...');

        const tasksToSeed = [
            {
                title: 'Follow up with UI Designer',
                description: 'Send a message regarding wireframe delivery and dashboard color schemes.',
                status: 'COMPLETED',
                priority: 'HIGH',
            },
            {
                title: 'Setup PostgreSQL Database Pooling',
                description: 'Configure Neon DB connection pool, retry mechanisms, and migration scripts.',
                status: 'COMPLETED',
                priority: 'HIGH',
            },
            {
                title: 'Build Real-Time Stopwatch Engine',
                description: 'Implement start/stop session tracking with calculated elapsed duration.',
                status: 'IN_PROGRESS',
                priority: 'MEDIUM',
            },
            {
                title: 'Design Annual Activity Heatmap Matrix',
                description: 'Aggregate historical daily time logs into calendar intensity blocks.',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
            },
            {
                title: 'Configure Swagger API Documentation',
                description: 'Document Auth, Task, Timer, and Dashboard endpoints with OpenAPI 3.0.',
                status: 'PENDING',
                priority: 'MEDIUM',
            },
            {
                title: 'Conduct Code Review and Unit Tests',
                description: 'Verify route authorization, input validators, and error response formats.',
                status: 'PENDING',
                priority: 'LOW',
            },
        ];

        const createdTasks = [];
        for (const task of tasksToSeed) {
            const taskRes = await client.query(
                `INSERT INTO tasks (
                    user_id, title, description, status, priority
                ) VALUES ($1, $2, $3, $4, $5)
                RETURNING id, title, status;`,
                [mainUser.id, task.title, task.description, task.status, task.priority]
            );
            createdTasks.push(taskRes.rows[0]);
            console.log(`   📌 Task: "${taskRes.rows[0].title}" [${taskRes.rows[0].status}]`);
        }

        // ─── Step 5: Seed Historical Time Logs (Populate Heatmap & Streaks) ──
        console.log('⏱️️  Seeding historical time logs for dashboard activity matrix...');

        // Generate past log sessions over the last 14 days to provide streak and activity data
        const now = new Date();
        for (let daysAgo = 14; daysAgo >= 1; daysAgo--) {
            // Target specific seeded tasks in rotation
            const assignedTask = createdTasks[daysAgo % createdTasks.length];

            // Set logged date
            const logDate = new Date(now);
            logDate.setDate(now.getDate() - daysAgo);

            // Log Session 1 (Morning block: 45 to 90 minutes)
            const start1 = new Date(logDate);
            start1.setHours(10, 0, 0, 0);
            const duration1 = 3600 + (daysAgo * 180); // between ~1 hr and 1.7 hr
            const end1 = new Date(start1.getTime() + duration1 * 1000);

            await client.query(
                `INSERT INTO time_logs (
                    user_id, task_id, start_time, end_time, duration_seconds, is_running
                ) VALUES ($1, $2, $3, $4, $5, FALSE);`,
                [mainUser.id, assignedTask.id, start1, end1, duration1]
            );

            // Log Session 2 for select days to create varied intensity levels (6-10 / 10+)
            if (daysAgo % 2 === 0) {
                const start2 = new Date(logDate);
                start2.setHours(15, 30, 0, 0);
                const duration2 = 2400; // 40 minutes
                const end2 = new Date(start2.getTime() + duration2 * 1000);

                await client.query(
                    `INSERT INTO time_logs (
                        user_id, task_id, start_time, end_time, duration_seconds, is_running
                    ) VALUES ($1, $2, $3, $4, $5, FALSE);`,
                    [mainUser.id, assignedTask.id, start2, end2, duration2]
                );
            }
        }

        // ─── Step 6: Seed Today's Active Running Timer ──────────────────
        // One ongoing timer session so the real-time tracker displays an active state
        const activeTask = createdTasks.find((t) => t.status === 'IN_PROGRESS') || createdTasks[0];
        const activeStartTime = new Date(Date.now() - 25 * 60 * 1000); // Started 25 minutes ago

        await client.query(
            `INSERT INTO time_logs (
                user_id, task_id, start_time, end_time, duration_seconds, is_running
            ) VALUES ($1, $2, $3, NULL, 0, TRUE);`,
            [mainUser.id, activeTask.id, activeStartTime]
        );
        console.log(`   🟢 Active Live Timer seeded on Task: "${activeTask.title}"`);

        console.log('\n✨ Database seeding completed successfully!');
        console.log('──────────────────────────────────────────────────────');
        console.log('🔑 Demo Login Credentials:');
        console.log('   👑 Admin: admin@taskflow.com | Password: Admin@1234');
        console.log('   👤 User:  user@taskflow.com  | Password: User@1234');
        console.log('──────────────────────────────────────────────────────\n');

        return true;
    } catch (error) {
        console.error('❌ Critical error during database seeding:', error.message);
        throw error;
    } finally {
        client.release();
    }
};

// Auto-run if executed directly via command line: `node src/database/seed.js`
if (process.argv[1]?.endsWith('seed.js')) {
    seedDatabase()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}