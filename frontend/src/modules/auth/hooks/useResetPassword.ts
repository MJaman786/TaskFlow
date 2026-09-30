import { useMutation } from '@tanstack/react-query';
import { resetPasswordApi } from '../api/auth.api';
import type { ResetPasswordPayload } from '../types/auth.types';

interface ResetProp {
  payload: ResetPasswordPayload;
}

export default function useResetPassword() {
  return useMutation({
    mutationFn: async ({ payload }: ResetProp) => {
      const res = await resetPasswordApi(payload);
      return res;
    },
  });
}