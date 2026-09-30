import { useMutation } from '@tanstack/react-query';
import { logoutApi } from '../api/auth.api';
import { useAuthStore } from '../../../store/Auth/useAuthStore';

export default function useLogout() {
  return useMutation({
    mutationFn: async () => {
      const res = await logoutApi();
      useAuthStore.getState().logout();
      return res;
    },
  });
}