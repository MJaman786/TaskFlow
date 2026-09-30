export type UserRole = 'USER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  avatar?: string | null;
  isEmailVerified?: boolean;
  is_email_verified?: boolean;
  email_verified_at?: string | null;
  last_login?: string | null;
  created_at?: string;
  updated_at?: string;
}

// Request Payloads
export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface VerifyEmailPayload {
  email: string;
  otp: string;
}

export interface ResendVerificationPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}

// API Response Data Shapes (res.data)
export interface RegisterResponseData {
  user: User;
}

export interface LoginResponseData {
  accessToken: string;
  user: User;
}

export interface VerifyEmailResponseData {
  email: string;
  isEmailVerified: boolean;
}

export interface ResetPasswordResponseData {
  email: string;
}

export interface GetMeResponseData {
  user: User;
}