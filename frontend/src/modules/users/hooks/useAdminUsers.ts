import { useQuery } from '@tanstack/react-query';
import { getAdminUsersApi, getAdminUserByIdApi } from '../api/users.api';
import type { AdminUsersQueryParams } from '../types/users.types';

export const getAdminUsersQueryKey = (params?: AdminUsersQueryParams) => [
  'admin-users',
  params?.page,
  params?.limit,
  params?.search,
  params?.status,
];

export const getAdminUserByIdQueryKey = (id: string) => ['admin-users', id];

export function useAdminUsers(
  params?: AdminUsersQueryParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: getAdminUsersQueryKey(params),
    queryFn: async () => {
      const res = await getAdminUsersApi(params);
      return res;
    },
    enabled: options?.enabled ?? true,
  });
}

export function useAdminUserById(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: getAdminUserByIdQueryKey(id),
    queryFn: async () => {
      const res = await getAdminUserByIdApi(id);
      return res;
    },
    enabled: Boolean(id) && (options?.enabled ?? true),
  });
}

export default useAdminUsers;