import { useQuery } from '@tanstack/react-query';
import { getTaskOverviewApi } from '../api/dashboard.api';

export const TASK_OVERVIEW_QUERY_KEY = ['dashboard', 'overview'];

export function useTaskOverview(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: TASK_OVERVIEW_QUERY_KEY,
    queryFn: async () => {
      const res = await getTaskOverviewApi();
      return res;
    },
    enabled: options?.enabled ?? true,
  });
}

export default useTaskOverview;