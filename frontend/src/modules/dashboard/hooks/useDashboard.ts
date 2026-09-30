import { useQuery } from '@tanstack/react-query';
import { getConsolidatedDashboardApi } from '../api/dashboard.api';
import type { DashboardQueryParams } from '../types/dashboard.types';

export const getDashboardQueryKey = (year?: number) => [
  'dashboard',
  'consolidated',
  year ?? new Date().getFullYear(),
];

export function useDashboard(
  params?: DashboardQueryParams,
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  return useQuery({
    queryKey: getDashboardQueryKey(params?.year),
    queryFn: async () => {
      const res = await getConsolidatedDashboardApi(params);
      return res;
    },
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
  });
}

export default useDashboard;