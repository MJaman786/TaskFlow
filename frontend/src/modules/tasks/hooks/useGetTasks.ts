import { useQuery } from '@tanstack/react-query';
import { getTasksApi, getTaskByIdApi } from '../api/task.api';
import type { TaskQueryParams } from '../types/task.types';

export const getTasksQueryKey = (params?: TaskQueryParams) => [
  'tasks',
  params?.page,
  params?.limit,
  params?.status,
  params?.priority,
  params?.search,
];

export const getSingleTaskQueryKey = (id: string) => ['tasks', id];

export function useGetTasks(params?: TaskQueryParams, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: getTasksQueryKey(params),
    queryFn: async () => {
      const res = await getTasksApi(params);
      return res;
    },
    enabled: options?.enabled ?? true,
  });
}

export function useGetTaskById(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: getSingleTaskQueryKey(id),
    queryFn: async () => {
      const res = await getTaskByIdApi(id);
      return res;
    },
    enabled: Boolean(id) && (options?.enabled ?? true),
  });
}