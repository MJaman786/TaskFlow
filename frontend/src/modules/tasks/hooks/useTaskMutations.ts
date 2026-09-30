import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTaskApi, updateTaskApi, deleteTaskApi } from '../api/task.api';
import type { CreateTaskPayload, UpdateTaskPayload } from '../types/task.types';

interface CreateTaskVariables {
  payload: CreateTaskPayload;
}

interface UpdateTaskVariables {
  id: string;
  payload: UpdateTaskPayload;
}

interface DeleteTaskVariables {
  id: string;
}

export function useCreateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload }: CreateTaskVariables) => {
      const res = await createTaskApi(payload);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, payload }: UpdateTaskVariables) => {
      const res = await updateTaskApi(id, payload);
      return res;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteTaskVariables) => {
      const res = await deleteTaskApi(id);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// Unified mutations helper hook matching component imports
export function useTaskMutations() {
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();
  const deleteMutation = useDeleteTask();

  return {
    createTask: createMutation.mutate,
    createTaskAsync: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateTask: updateMutation.mutate,
    updateTaskAsync: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteTask: deleteMutation.mutate,
    deleteTaskAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}