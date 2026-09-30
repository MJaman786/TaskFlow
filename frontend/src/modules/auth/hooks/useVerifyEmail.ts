import { useMutation } from '@tanstack/react-query';
import { verifyEmailApi } from '../api/auth.api';
import type { VerifyEmailPayload } from '../types/auth.types';

interface VerifyProp {
  payload: VerifyEmailPayload;
}

export default function useVerifyEmail() {
  return useMutation({
    mutationFn: async ({ payload }: VerifyProp) => {
      const res = await verifyEmailApi(payload);
      return res;
    },
  });
}