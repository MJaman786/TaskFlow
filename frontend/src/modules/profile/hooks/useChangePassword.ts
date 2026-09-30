import { useMutation } from '@tanstack/react-query';
import { changePasswordApi } from '../api/profile.api';
import type { ChangePasswordPayload } from '../types/profile.types';

interface ChangePasswordVariables {
  payload: ChangePasswordPayload;
}

export default function useChangePassword() {
  return useMutation({
    mutationFn: async ({ payload }: ChangePasswordVariables) => {
      const res = await changePasswordApi(payload);
      return res;
    },
  });
}