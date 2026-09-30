import { create } from 'zustand';
import type { ActiveTimerSession } from '../../modules/timetrack/types/timetrack.types';

interface TimerStoreTypes {
  activeSession: ActiveTimerSession | null;
  elapsedSeconds: number;
  isRunning: boolean;
  setActiveTimer: (session: ActiveTimerSession | null) => void;
  tick: () => void;
  clearTimer: () => void;
}

export const useTimerStore = create<TimerStoreTypes>((set, get) => ({
  activeSession: null,
  elapsedSeconds: 0,
  isRunning: false,

  setActiveTimer: (session) => {
    if (!session) {
      set({
        activeSession: null,
        elapsedSeconds: 0,
        isRunning: false,
      });
      return;
    }

    // Calculate real-time elapsed seconds based on the start_time from Neon DB
    const startMs = new Date(session.start_time).getTime();
    const initialElapsed = Math.max(0, Math.floor((Date.now() - startMs) / 1000));

    set({
      activeSession: session,
      elapsedSeconds: initialElapsed,
      isRunning: session.is_running,
    });
  },

  tick: () => {
    const { activeSession, isRunning } = get();
    if (!isRunning || !activeSession?.start_time) return;

    // Recalculate against timestamp to prevent interval drift
    const startMs = new Date(activeSession.start_time).getTime();
    const updatedElapsed = Math.max(0, Math.floor((Date.now() - startMs) / 1000));

    set({ elapsedSeconds: updatedElapsed });
  },

  clearTimer: () => {
    set({
      activeSession: null,
      elapsedSeconds: 0,
      isRunning: false,
    });
  },
}));