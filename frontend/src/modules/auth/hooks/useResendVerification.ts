import { useMutation } from '@tanstack/react-query';
import { resendVerificationApi } from '../api/auth.api';
import type { ResendVerificationPayload } from '../types/auth.types';

interface ResendProp {
  payload: ResendVerificationPayload;
}

export default function useResendVerification() {
  return useMutation({
    mutationFn: async ({ payload }: ResendProp) => {
      const res = await resendVerificationApi(payload);
      return res;
    },
  });
}