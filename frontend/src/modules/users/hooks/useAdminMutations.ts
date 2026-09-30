import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateAdminUserStatusApi, deleteAdminUserApi } from '../api/users.api';
import type { UpdateUserStatusPayload } from '../types/users.types';

interface UpdateUserStatusVariables {
  id: string;
  payload: UpdateUserStatusPayload;
}

interface DeleteUserVariables {
  id: string;
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateUserStatusVariables) => {
      const res = await updateAdminUserStatusApi(id, payload);
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-users', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteUserVariables) => {
      const res = await deleteAdminUserApi(id);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
    },
  });
}

export function useAdminMutations() {
  const updateStatusMutation = useUpdateUserStatus();
  const deleteUserMutation = useDeleteUser();

  return {
    updateStatus: updateStatusMutation.mutate,
    updateStatusAsync: updateStatusMutation.mutateAsync,
    isUpdatingStatus: updateStatusMutation.isPending,

    deleteUser: deleteUserMutation.mutate,
    deleteUserAsync: deleteUserMutation.mutateAsync,
    isDeletingUser: deleteUserMutation.isPending,
  };
}