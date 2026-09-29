-- ─── Database Schema Migration Script ─────────────────────────────────────
-- Neon PostgreSQL relational schema for Users, Auth, Tasks, and Time Logs

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name              VARCHAR(100) NOT NULL,
    email             VARCHAR(255) NOT NULL UNIQUE,
    password          VARCHAR(255) NOT NULL,
    role              VARCHAR(20)  NOT NULL DEFAULT 'USER' CHECK (role IN ('USER', 'ADMIN')),
    status            VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED')),
    avatar            TEXT         DEFAULT NULL,
    is_email_verified BOOLEAN      NOT NULL DEFAULT FALSE,
    email_verified_at TIMESTAMPTZ  DEFAULT NULL,
    last_login        TIMESTAMPTZ  DEFAULT NULL,
    created_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- 2. OTP Verification Table (Email Verification & Password Reset)
CREATE TABLE IF NOT EXISTS otps (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type        VARCHAR(30) NOT NULL CHECK (type IN ('EMAIL_VERIFICATION', 'PASSWORD_RESET')),
    otp_hash    VARCHAR(64) NOT NULL,
    attempts    INT NOT NULL DEFAULT 0,
    used        BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at  TIMESTAMPTZ NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otps_user_type ON otps(user_id, type);
CREATE INDEX IF NOT EXISTS idx_otps_expiry ON otps(expires_at);

-- 3. Sessions Table (Refresh Token Rotation & Revocation)
CREATE TABLE IF NOT EXISTS sessions (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(64) NOT NULL,
    ip                 VARCHAR(100) DEFAULT 'unknown',
    user_agent         TEXT DEFAULT 'unknown',
    revoked            BOOLEAN NOT NULL DEFAULT FALSE,
    login_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    logout_at          TIMESTAMPTZ DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_user_revoked ON sessions(user_id, revoked);

-- 4. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title       VARCHAR(250) NOT NULL,
    description TEXT DEFAULT '',
    status      VARCHAR(20) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED')),
    priority    VARCHAR(20) NOT NULL DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH')),
    due_date    TIMESTAMPTZ DEFAULT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created ON tasks(created_at DESC);

-- 5. Time Logs Table (Real-Time Tracker & Historical Records)
CREATE TABLE IF NOT EXISTS time_logs (
    id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    task_id          UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    start_time       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_time         TIMESTAMPTZ DEFAULT NULL,
    duration_seconds INT NOT NULL DEFAULT 0,
    is_running       BOOLEAN NOT NULL DEFAULT FALSE,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_timelogs_user ON time_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_timelogs_task ON time_logs(task_id);
CREATE INDEX IF NOT EXISTS idx_timelogs_running ON time_logs(user_id, is_running);
CREATE INDEX IF NOT EXISTS idx_timelogs_start_time ON time_logs(start_time DESC);

-- 6. Trigger to automatically update updated_at timestamps
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trg_tasks_updated_at ON tasks;
CREATE TRIGGER trg_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trg_time_logs_updated_at ON time_logs;
CREATE TRIGGER trg_time_logs_updated_at
    BEFORE UPDATE ON time_logs
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();