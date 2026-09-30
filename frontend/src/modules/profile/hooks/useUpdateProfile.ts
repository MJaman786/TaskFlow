import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProfileApi } from '../api/profile.api';
import { useAuthStore } from '../../../store/Auth/useAuthStore';
import { GET_ME_QUERY_KEY } from '../../auth/hooks/useGetMe';
import type { UpdateProfilePayload } from '../types/profile.types';

interface UpdateProfileVariables {
  payload: UpdateProfilePayload;
}

export default function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload }: UpdateProfileVariables) => {
      const res = await updateProfileApi(payload);
      if (res?.success && res.data?.user) {
        const currentToken = useAuthStore.getState().token;
        if (currentToken) {
          useAuthStore.getState().login(res.data.user, currentToken);
        }
      }
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GET_ME_QUERY_KEY });
    },
  });
}