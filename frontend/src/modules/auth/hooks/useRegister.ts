import { useMutation } from '@tanstack/react-query';
import { registerApi } from '../api/auth.api';
import type { RegisterPayload } from '../types/auth.types';

interface RegisterProp {
  payload: RegisterPayload;
}

export default function useRegister() {
  return useMutation({
    mutationFn: async ({ payload }: RegisterProp) => {
      const res = await registerApi(payload);
      return res;
    },
  });
}