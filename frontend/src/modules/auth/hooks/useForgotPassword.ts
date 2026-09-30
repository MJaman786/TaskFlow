import { useMutation } from '@tanstack/react-query';
import { forgotPasswordApi } from '../api/auth.api';
import type { ForgotPasswordPayload } from '../types/auth.types';

interface ForgotProp {
  payload: ForgotPasswordPayload;
}

export default function useForgotPassword() {
  return useMutation({
    mutationFn: async ({ payload }: ForgotProp) => {
      const res = await forgotPasswordApi(payload);
      return res;
    },
  });
}