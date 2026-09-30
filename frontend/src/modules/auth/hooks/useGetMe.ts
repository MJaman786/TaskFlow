import { useQuery } from '@tanstack/react-query';
import { getMeApi } from '../api/auth.api';
import { useAuthStore } from '../../../store/Auth/useAuthStore';

export const GET_ME_QUERY_KEY = ['get-me'];

export default function useGetMe(options?: { enabled?: boolean }) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

  return useQuery({
    queryKey: GET_ME_QUERY_KEY,
    queryFn: async () => {
      const res = await getMeApi();
      return res;
    },
    enabled: options?.enabled ?? isLoggedIn,
  });
}