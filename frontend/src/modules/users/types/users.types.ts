import type { UserRole, UserStatus } from '../../auth/types/auth.types';

export interface AdminUserListItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar: string | null;
  is_email_verified: boolean;
  last_login: string | null;
  created_at: string;
  total_tasks_created: number;
  total_logged_seconds: number;
}

export interface AdminUserDetail {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar: string | null;
  is_email_verified: boolean;
  email_verified_at: string | null;
  last_login: string | null;
  created_at: string;
  total_tasks: number;
  completed_tasks: number;
  total_seconds_tracked: number;
}

export interface AdminPlatformStats {
  total_users: number;
  active_users: number;
  suspended_users: number;
  total_tasks: number;
  completed_tasks: number;
  active_timers_running: number;
  total_seconds_tracked: number;
  total_hours_tracked: number;
}

// Request Query & Payloads
export interface AdminUsersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus | '';
}

export interface UpdateUserStatusPayload {
  status: UserStatus;
}

// API Response Shapes (res.data)
export interface AdminUsersResponseData {
  users: AdminUserListItem[];
}

export interface AdminUserDetailResponseData {
  user: AdminUserDetail;
}

export interface UpdateUserStatusResponseData {
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    updated_at: string;
  };
}

export interface DeleteUserResponseData {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AdminStatsResponseData {
  stats: AdminPlatformStats;
}