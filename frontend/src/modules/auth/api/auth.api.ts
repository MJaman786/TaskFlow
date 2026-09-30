import makeRequest from '../../../utils/helpers/MakeRequest';
import {
  REGISTER,
  LOGIN,
  LOGOUT,
  GET_ME,
  VERIFY_EMAIL,
  RESEND_VERIFICATION,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
} from '../../../constants/urls';
import type {
  RegisterPayload,
  RegisterResponseData,
  LoginPayload,
  LoginResponseData,
  VerifyEmailPayload,
  VerifyEmailResponseData,
  ResendVerificationPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  ResetPasswordResponseData,
  GetMeResponseData,
} from '../types/auth.types';

export const registerApi = async (payload: RegisterPayload) => {
  const res = await makeRequest<RegisterResponseData>({
    pathname: REGISTER,
    method: 'POST',
    showMessage: true,
    values: { ...payload },
    token: false,
  });
  return res;
};

export const resendVerificationApi = async (payload: ResendVerificationPayload) => {
  const res = await makeRequest<null>({
    pathname: RESEND_VERIFICATION,
    method: 'POST',
    showMessage: true,
    values: { ...payload },
    token: false,
  });
  return res;
};

export const verifyEmailApi = async (payload: VerifyEmailPayload) => {
  const res = await makeRequest<VerifyEmailResponseData>({
    pathname: VERIFY_EMAIL,
    method: 'POST',
    showMessage: true,
    values: { ...payload },
    token: false,
  });
  return res;
};

export const loginApi = async (payload: LoginPayload) => {
  const res = await makeRequest<LoginResponseData>({
    pathname: LOGIN,
    method: 'POST',
    showMessage: true,
    values: { ...payload },
    token: false,
  });
  return res;
};

export const logoutApi = async () => {
  const res = await makeRequest<null>({
    pathname: LOGOUT,
    method: 'POST',
    showMessage: true,
    token: true,
  });
  return res;
};

export const getMeApi = async () => {
  const res = await makeRequest<GetMeResponseData>({
    pathname: GET_ME,
    method: 'GET',
    token: true,
  });
  return res;
};

export const forgotPasswordApi = async (payload: ForgotPasswordPayload) => {
  const res = await makeRequest<null>({
    pathname: FORGOT_PASSWORD,
    method: 'POST',
    showMessage: true,
    values: { ...payload },
    token: false,
  });
  return res;
};

export const resetPasswordApi = async (payload: ResetPasswordPayload) => {
  const res = await makeRequest<ResetPasswordResponseData>({
    pathname: RESET_PASSWORD,
    method: 'POST',
    showMessage: true,
    values: { ...payload },
    token: false,
  });
  return res;
};