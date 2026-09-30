import { useQuery } from '@tanstack/react-query';
import { getActiveTimerApi } from '../api/timetrack.api';

export const ACTIVE_TIMER_QUERY_KEY = ['active-timer'];

export function useActiveTimer(options?: {
  enabled?: boolean;
  refetchInterval?: number | false;
}) {
  return useQuery({
    queryKey: ACTIVE_TIMER_QUERY_KEY,
    queryFn: async () => {
      const res = await getActiveTimerApi();
      return res;
    },
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval ?? 5000, // Poll every 5s if active timer exists
  });
}

export default useActiveTimer;