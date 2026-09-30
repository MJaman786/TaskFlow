import { useQuery } from '@tanstack/react-query';
import { getAdminStatsApi } from '../api/users.api';

export const ADMIN_STATS_QUERY_KEY = ['admin-stats'];

export function useAdminStats(options?: {
  enabled?: boolean;
  refetchInterval?: number;
}) {
  return useQuery({
    queryKey: ADMIN_STATS_QUERY_KEY,
    queryFn: async () => {
      const res = await getAdminStatsApi();
      return res;
    },
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
  });
}

export default useAdminStats;