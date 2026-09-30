import { useMutation } from '@tanstack/react-query';
import { loginApi } from '../api/auth.api';
import { useAuthStore } from '../../../store/Auth/useAuthStore';
import type { LoginPayload } from '../types/auth.types';

interface LoginProp {
  payload: LoginPayload;
}

export default function useLogin() {
  return useMutation({
    mutationFn: async ({ payload }: LoginProp) => {
      const res = await loginApi(payload);
      if (res?.success && res.data) {
        useAuthStore.getState().login(res.data.user, res.data.accessToken);
      }
      return res;
    },
  });
}