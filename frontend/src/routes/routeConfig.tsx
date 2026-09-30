import React from 'react';
import Login from '../modules/auth/components/Login';
import SignUp from '../modules/auth/components/SignUp';
import VerifyEmail from '../modules/auth/components/VerifyEmail';
import ForgotPassword from '../modules/auth/pages/ForgotPasswordPage';
import ResetPassword from '../modules/auth/pages/ResetPasswordPage';
import Unauthorized from '../pages/UnAuthorized';
import Home from '../modules/home/components';

// Workspace & Management Pages
import DashboardPage from '../modules/dashboard/pages/DashboardPage';
import TasksPage from '../modules/tasks/pages/TasksPage';
import TimeLogsPage from '../modules/timetrack/pages/TimeLogsPage';
import ProfilePage from '../modules/profile/pages/ProfilePage';
import UsersPage from '../modules/users/pages/UsersPage';

export type UserRole = 'USER' | 'ADMIN';

export interface AppRoute {
  path: string;
  element: React.ReactNode;
  isPrivate: boolean;
  roles?: UserRole[];
  activePage?: string;
}

export const AppRoutes: AppRoute[] = [
  // ─── Public Authentication Routes ─────────────────────────────────────
  { path: '/', element: <Home />, isPrivate: false },
  { path: '/login', element: <Login />, isPrivate: false },
  { path: '/signup', element: <SignUp />, isPrivate: false },
  { path: '/verify-email', element: <VerifyEmail />, isPrivate: false },
  { path: '/forgot-password', element: <ForgotPassword />, isPrivate: false },
  { path: '/reset-password', element: <ResetPassword />, isPrivate: false },
  { path: '/unauthorized', element: <Unauthorized />, isPrivate: false },

  // ─── Authenticated Workspace Routes (USER & ADMIN) ────────────────────
  {
    path: '/dashboard',
    element: <DashboardPage />,
    isPrivate: true,
    roles: ['USER', 'ADMIN'],
    activePage: 'Dashboard',
  },
  {
    path: '/tasks',
    element: <TasksPage />,
    isPrivate: true,
    roles: ['USER', 'ADMIN'],
    activePage: 'Tasks',
  },
  {
    path: '/time-logs',
    element: <TimeLogsPage />,
    isPrivate: true,
    roles: ['USER', 'ADMIN'],
    activePage: 'Time Logs',
  },
  {
    path: '/profile',
    element: <ProfilePage />,
    isPrivate: true,
    roles: ['USER', 'ADMIN'],
    activePage: 'Profile',
  },

  // ─── Platform Administration Restricted Route (ADMIN ONLY) ───────────
  {
    path: '/admin/users',
    element: <UsersPage />,
    isPrivate: true,
    roles: ['ADMIN'],
    activePage: 'User Directory',
  },
];