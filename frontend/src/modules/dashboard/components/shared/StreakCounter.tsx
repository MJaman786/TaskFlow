import React from 'react';
import { Flame } from 'lucide-react';
import type { StreakInfo } from '../../types/dashboard.types';

interface StreakCounterProps {
  streakInfo: StreakInfo;
}

export default function StreakCounter({ streakInfo }: StreakCounterProps) {
  return (
    <div className="bg-surface-card border border-hairline-strong rounded-xl p-5 shadow-card-soft font-sans flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-medium text-muted uppercase tracking-wider">Continuous Coding</h3>
        <div className="flex items-center gap-1 text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-sm">
          <Flame size={12} className="animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase">{streakInfo.currentStreak}d Streak</span>
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-poppins font-bold text-ink leading-none">{streakInfo.currentStreak}</span>
        <span className="text-sm font-medium text-body">Days</span>
      </div>

      <div className="mt-4 pt-4 border-t border-hairline flex flex-col gap-1.5 text-xs text-muted">
        <div className="flex justify-between items-center">
          <span>Longest streak recorded:</span>
          <span className="font-mono font-medium text-ink">{streakInfo.longestStreak} days</span>
        </div>
        <div className="flex justify-between items-center">
          <span>Total active days:</span>
          <span className="font-mono font-medium text-ink">{streakInfo.daysActive} days</span>
        </div>
      </div>
    </div>
  );
}
