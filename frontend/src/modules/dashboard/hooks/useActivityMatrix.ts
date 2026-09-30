import { useQuery } from '@tanstack/react-query';
import { getActivityMatrixApi } from '../api/dashboard.api';
import type { ActivityMatrixQueryParams } from '../types/dashboard.types';

export const getActivityMatrixQueryKey = (year?: number) => [
  'dashboard',
  'activity-matrix',
  year ?? new Date().getFullYear(),
];

export function useActivityMatrix(
  params?: ActivityMatrixQueryParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: getActivityMatrixQueryKey(params?.year),
    queryFn: async () => {
      const res = await getActivityMatrixApi(params);
      return res;
    },
    enabled: options?.enabled ?? true,
  });
}

export default useActivityMatrix;