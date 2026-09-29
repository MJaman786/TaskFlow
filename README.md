# TaskFlow — Task & Real-Time Time Tracking Platform

A modern, full-stack productivity ecosystem featuring real-time stopwatch session tracking, daily productivity summaries, interactive annual activity heatmaps, natural language task parsing, and administrative management.

---

## Overview Preview

> **Note**: Save your application dashboard screenshot as `overview.png` in the root directory to display the platform preview.
> 
> 

---

## Key Features

### 1. Robust Authentication & Session Security

* **Email OTP Verification**: User registration triggers a 6-digit numeric OTP via Nodemailer HTML templates.
* **JWT Access & Refresh Rotation**: Dual-token architecture with secure, `HttpOnly`, `SameSite` session cookies.
* **Self-Service Password Recovery**: Secure OTP-based password reset workflows with instant multi-device session revocation.
* **Role-Based Access Control (RBAC)**: Enforced segregation between `USER` and `ADMIN` roles.

### 2. Task Management & Natural Language Assistant

* **Task Lifecycle Operations**: Full CRUD capabilities supporting `PENDING`, `IN_PROGRESS`, and `COMPLETED` states, priority levels (`LOW`, `MEDIUM`, `HIGH`), and due dates.


* **Natural Language Task Suggester**: Transforms rough natural language input (e.g., *"follow up with designer regarding wireframes asap"*) into structured titles, descriptions, and urgency ratings.


* **Strict Tenant Data Isolation**: Users can view and operate only their own tasks and time records.



### 3. Real-Time Time Tracking Engine

* **Single-Timer Enforcement**: Enforces a strict one-active-timer constraint per user to prevent session overlapping.


* **Live Stopwatch Controls**: Start and stop operations with automatic task status transitions.


* **Session Logging**: Precise elapsed-duration tracking in seconds, historical query logs, and manual time logging.



### 4. Insightful Productivity Dashboard & Matrix

* **Daily Productivity Snapshot**: Real-time aggregation of today's logged hours, tasks in progress, and completed items.


* **Annual Activity Heatmap Matrix**: Calendar matrix aggregating daily sessions across the year with intensity levels (`0 (Blank)`, `1–5`, `6–10`, `10+`).
* **Streak Calculator**: Computes consecutive active working days (`currentStreak`, `longestStreak`, `daysActive`).
* **Distribution Metrics**: Task status and priority counts tailored for donut and progress visualization.

### 5. Administrative Oversight

* **User Directory**: View all registered users with paginated task creation and tracked time metrics.
* **Account Controls**: Toggle user status (`ACTIVE` vs `SUSPENDED`) with immediate session termination upon suspension.
* **Account Deletion**: Foreign-key cascade deletion with automated email confirmation alerts.
* **Platform Metrics**: System-wide telemetry detailing user counts, task totals, active timers, and lifetime hours tracked.

---

## Tech Stack

### Backend

* **Runtime & Framework**: Node.js (ES Modules, `"type": "module"`), Express.js
* **Database**: PostgreSQL (Neon Serverless PostgreSQL with `pg` connection pooling)
* **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcrypt`, `cookie-parser`
* **Validation & Utilities**: Joi, UUIDv4
* **Email Engine**: Nodemailer (Gmail SMTP with HTML responsive layouts)
* **API Documentation**: Swagger UI Express (`swagger-ui-express`, OpenAPI 3.0)
* **Development**: Nodemon, Morgan

### Frontend

* **Core**: React 19, TypeScript, Vite
* **State & Server Cache**: Zustand, TanStack React Query
* **Routing & Networking**: React Router DOM, Axios
* **Forms & Validation**: Formik, Yup
* **UI & Styling**: Tailwind CSS, Framer Motion, Lucide React, React Hot Toast, React Loading Skeleton
* **Data Visualization**: Chart.js

---

## Project Structure

```text
taskflow-backend/
├── .env.example
├── .gitignore
├── package.json
├── README.md
├── overview.png
├── src/
│   ├── app.js
│   ├── server.js
│   ├── common/
│   │   ├── AppError.js
│   │   ├── asyncHandler.js
│   │   ├── constants.js
│   │   └── response.js
│   ├── config/
│   │   ├── db.config.js
│   │   └── env.config.js
│   ├── database/
│   │   ├── migrate.js
│   │   ├── schema.sql
│   │   └── seed.js
│   ├── docs/
│   │   └── swagger.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── errorHandler.middleware.js
│   │   ├── notFound.middleware.js
│   │   ├── roles.middleware.js
│   │   └── validate.middleware.js
│   ├── modules/
│   │   ├── admin/
│   │   │   ├── admin.controller.js
│   │   │   ├── admin.routes.js
│   │   │   └── admin.service.js
│   │   ├── auth/
│   │   │   ├── auth.controller.js
│   │   │   ├── auth.routes.js
│   │   │   ├── auth.service.js
│   │   │   ├── auth.validation.js
│   │   │   ├── otp.model.js
│   │   │   ├── session.model.js
│   │   │   └── user.model.js
│   │   ├── dashboard/
│   │   │   ├── dashboard.controller.js
│   │   │   ├── dashboard.routes.js
│   │   │   └── dashboard.service.js
│   │   ├── task/
│   │   │   ├── task.controller.js
│   │   │   ├── task.model.js
│   │   │   ├── task.routes.js
│   │   │   ├── task.service.js
│   │   │   └── task.validation.js
│   │   └── timetrack/
│   │       ├── timetrack.controller.js
│   │       ├── timetrack.model.js
│   │       ├── timetrack.routes.js
│   │       ├── timetrack.service.js
│   │       └── timetrack.validation.js
│   ├── shared/
│   │   └── mail.js
│   ├── templates/
│   │   ├── auth/
│   │   ├── layouts/
│   │   └── user/
│   └── utils/
│       └── generators.utils.js

```

---

## Getting Started

### Prerequisites

* **Node.js**: v18.x or higher
* **npm**: v9.x or higher
* **Database**: Neon PostgreSQL connection URL (or local PostgreSQL instance)
* **Email (Optional for local testing)**: Gmail App Password for sending real OTP emails

---

### Installation & Local Setup



1. **Clone the repository**:
```bash
git clone https://github.com/your-username/taskflow.git
cd taskflow/backend

```


2. **Install dependencies**:
```bash
npm install

```


3. **Configure Environment Variables**:
Create a `.env` file in the root directory:
```bash
cp .env.example .env

```


Update `.env` with your credentials:
```env
PORT=9000
NODE_ENV=development

DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require

JWT_SECRET=super_secret_jwt_access_key_min_32_characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=super_secret_jwt_refresh_key_min_32_characters
JWT_REFRESH_EXPIRES_IN=7d

GOOGLE_USER_EMAIL=your-email@gmail.com
GOOGLE_APP_PASSWORD=your-google-app-password

ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

```


4. **Run Database Migrations**:
Executes `schema.sql` to initialize tables, indexes, and triggers on Neon PostgreSQL:
```bash
npm run db:migrate

```


5. **Seed Demo Data**:
Populates accounts, tasks, historical time logs, and an active running timer:
```bash
npm run db:seed

```


6. **Start the Development Server**:
```bash
npm run dev

```


The server will start at: `http://localhost:9000`

---

## Test Accounts & Credentials



The database seeder configures the following pre-verified accounts:

| Role | Email | Password | Primary Purpose |
| --- | --- | --- | --- |
| **`ADMIN`** | `admin@taskflow.com` | `Admin@1234` | User oversight, status toggle, account deletion |
| **`USER`** | `user@taskflow.com` | `User@1234` | Task management, live stopwatch timer, analytics

 |
| **`USER` (Secondary)** | `demo@taskflow.com` | `User@1234` | Verifying user data isolation

 |

---

## API Documentation (Swagger)

Interactive OpenAPI 3.0 documentation is available directly through the server with token persistence enabled:

* **Documentation URL**: `http://localhost:9000/api-docs`
* **Server Health Route**: `http://localhost:9000/health`
* **Test Banner Route**: `http://localhost:9000/`

### Primary API Routes

#### Authentication (`/api/v1/auth`)

* `POST /register` — Register account (dispatches 6-digit email OTP)
* `POST /verify-email` — Verify account using 6-digit OTP
* `POST /resend-verification` — Resend verification OTP
* `POST /login` — Authenticate and receive access token + refresh cookie
* `POST /refresh` — Rotate refresh token and obtain new access token
* `POST /forgot-password` — Dispatch recovery code to email
* `POST /reset-password` — Reset password using recovery code
* `GET  /me` — Retrieve current authenticated profile *(Protected)*
* `PATCH /profile` — Update name or avatar *(Protected)*
* `PATCH /change-password` — Change password and terminate other sessions *(Protected)*
* `POST /logout` — Invalidate current active session *(Protected)*

#### Tasks (`/api/v1/tasks`) *(Protected)*

* `GET    /` — List tasks with status/priority filters, search, and pagination


* `POST   /` — Create a new task


* `POST   /ai-suggest` — Auto-generate title and structured description from plain text


* `GET    /:id` — Retrieve task details


* `PATCH  /:id` — Update title, description, status, or priority


* `DELETE /:id` — Permanently delete a task and cascade its time logs



#### Time Tracking (`/api/v1/time-logs`) *(Protected)*

* `GET    /active` — Fetch current running stopwatch timer with elapsed seconds


* `POST   /start` — Start tracking on a task (enforces one active timer rule)


* `POST   /stop` — Stop running timer and record session duration


* `POST   /manual` — Record a completed past time entry
* `GET    /` — List time logs with task/date range filters and pagination


* `DELETE /:id` — Delete a time log entry

#### Dashboard & Analytics (`/api/v1/dashboard`) *(Protected)*

* `GET /` — Consolidated payload (Daily summary + Heatmap + Distribution)
* `GET /daily` — Today's tracked time, completed count, and pending tasks


* `GET /activity-matrix?year=2026` — Contribution matrix and streak counter
* `GET /overview` — Status and priority breakdown for donut charts

#### Administration (`/api/v1/admin`) *(Protected: Admin Only)*

* `GET    /stats` — Platform-wide metrics (users, tasks, total tracked hours)
* `GET    /users` — Paginated user directory with activity metrics
* `GET    /users/:id` — Detailed user profile and session history
* `PATCH  /users/:id/status` — Toggle status between `ACTIVE` and `SUSPENDED`
* `DELETE /users/:id` — Delete user account and dispatch deletion notification email

---

## Live Deployment Links



* **Live Demo (Frontend)**: [https://taskflow.yourdomain.com](https://www.google.com/search?q=https://taskflow.yourdomain.com)

* **API Server (Backend)**: [https://api.taskflow.yourdomain.com](https://www.google.com/search?q=https://api.taskflow.yourdomain.com)

* **Interactive Swagger UI**: [https://api.taskflow.yourdomain.com/api-docs](https://www.google.com/search?q=https://api.taskflow.yourdomain.com/api-docs)