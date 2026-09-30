import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  startTimerApi,
  stopTimerApi,
  logManualTimeApi,
  deleteTimeLogApi,
} from '../api/timetrack.api';
import type {
  StartTimerPayload,
  StopTimerPayload,
  ManualLogPayload,
} from '../types/timetrack.types';

interface StartTimerVariables {
  payload: StartTimerPayload;
}

interface StopTimerVariables {
  payload?: StopTimerPayload;
}

interface ManualLogVariables {
  payload: ManualLogPayload;
}

interface DeleteTimeLogVariables {
  id: string;
}

export function useStartTimer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload }: StartTimerVariables) => {
      const res = await startTimerApi(payload);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-timer'] });
      queryClient.invalidateQueries({ queryKey: ['time-logs'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useStopTimer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables?: StopTimerVariables) => {
      const res = await stopTimerApi(variables?.payload);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['active-timer'] });
      queryClient.invalidateQueries({ queryKey: ['time-logs'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useManualLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload }: ManualLogVariables) => {
      const res = await logManualTimeApi(payload);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-logs'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteTimeLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id }: DeleteTimeLogVariables) => {
      const res = await deleteTimeLogApi(id);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['time-logs'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

// Unified mutations helper hook
export function useTimeTrackMutations() {
  const startTimerMutation = useStartTimer();
  const stopTimerMutation = useStopTimer();
  const manualLogMutation = useManualLog();
  const deleteLogMutation = useDeleteTimeLog();

  return {
    startTimer: startTimerMutation.mutate,
    startTimerAsync: startTimerMutation.mutateAsync,
    isStarting: startTimerMutation.isPending,

    stopTimer: stopTimerMutation.mutate,
    stopTimerAsync: stopTimerMutation.mutateAsync,
    isStopping: stopTimerMutation.isPending,

    logManualTime: manualLogMutation.mutate,
    logManualTimeAsync: manualLogMutation.mutateAsync,
    isLoggingManual: manualLogMutation.isPending,

    deleteTimeLog: deleteLogMutation.mutate,
    deleteTimeLogAsync: deleteLogMutation.mutateAsync,
    isDeleting: deleteLogMutation.isPending,
  };
}