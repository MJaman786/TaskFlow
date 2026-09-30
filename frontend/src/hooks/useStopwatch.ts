import { useEffect } from 'react';
import { useTimerStore } from '../store/Timer/useTimerStore';
import { useActiveTimer } from '../modules/timetrack/hooks/useActiveTimer';

export function useStopwatch() {
  const { activeSession, elapsedSeconds, isRunning, tick, setActiveTimer } =
    useTimerStore();

  // Query backend for active running timer
  const { data: activeTimerRes, isLoading } = useActiveTimer({
    refetchInterval: isRunning ? false : 10000,
  });

  // Sync store whenever backend query completes
  useEffect(() => {
    if (activeTimerRes?.success) {
      const serverSession = activeTimerRes.data?.activeTimer ?? null;
      setActiveTimer(serverSession);
    }
  }, [activeTimerRes, setActiveTimer]);

  // 1-second interval ticker for live timer display
  useEffect(() => {
    if (!isRunning) return;

    const intervalId = window.setInterval(() => {
      tick();
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [isRunning, tick]);

  return {
    activeSession,
    elapsedSeconds,
    isRunning,
    isLoading,
  };
}

export default useStopwatch;