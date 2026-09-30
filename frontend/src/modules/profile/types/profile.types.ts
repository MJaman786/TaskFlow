import type { User } from '../../auth/types/auth.types';

export interface UpdateProfilePayload {
  name?: string;
  avatar?: string | null;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// API Response Shapes (res.data)
export interface UpdateProfileResponseData {
  user: User;
}

export type ChangePasswordResponseData = null;