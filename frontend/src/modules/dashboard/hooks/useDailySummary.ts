import { useQuery } from '@tanstack/react-query';
import { getDailySummaryApi } from '../api/dashboard.api';

export const DAILY_SUMMARY_QUERY_KEY = ['dashboard', 'daily'];

export function useDailySummary(options?: {
  enabled?: boolean;
  refetchInterval?: number;
}) {
  return useQuery({
    queryKey: DAILY_SUMMARY_QUERY_KEY,
    queryFn: async () => {
      const res = await getDailySummaryApi();
      return res;
    },
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
  });
}

export default useDailySummary;