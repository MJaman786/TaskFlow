import { useQuery } from '@tanstack/react-query';
import { getTimeLogsApi } from '../api/timetrack.api';
import type { TimeLogQueryParams } from '../types/timetrack.types';

export const getTimeLogsQueryKey = (params?: TimeLogQueryParams) => [
  'time-logs',
  params?.page,
  params?.limit,
  params?.taskId,
  params?.from,
  params?.to,
];

export function useGetTimeLogs(
  params?: TimeLogQueryParams,
  options?: { enabled?: boolean; refetchInterval?: number }
) {
  return useQuery({
    queryKey: getTimeLogsQueryKey(params),
    queryFn: async () => {
      const res = await getTimeLogsApi(params);
      return res;
    },
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
  });
}

export default useGetTimeLogs;