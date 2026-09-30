import React from 'react';
import type { TaskOverviewData } from '../../types/dashboard.types';
import { formatDuration } from '../../../../utils/formatters/FormatDuration';

interface OverviewDonutChartProps {
  overview: TaskOverviewData;
}

export default function OverviewDonutChart({ overview }: OverviewDonutChartProps) {
  const statusColors: Record<string, string> = {
    COMPLETED: 'bg-emerald-500',
    IN_PROGRESS: 'bg-blue-500',
    PENDING: 'bg-amber-500',
  };

  const statusBgColors: Record<string, string> = {
    COMPLETED: 'bg-emerald-500/10',
    IN_PROGRESS: 'bg-blue-500/10',
    PENDING: 'bg-amber-500/10',
  };

  const statusTextColors: Record<string, string> = {
    COMPLETED: 'text-emerald-500',
    IN_PROGRESS: 'text-blue-500',
    PENDING: 'text-amber-500',
  };

  const totalTasks = overview.statusBreakdown.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-surface-card border border-hairline-strong rounded-xl p-5 shadow-card-soft font-sans flex flex-col justify-between">
      <h3 className="text-xs font-medium text-muted uppercase tracking-wider mb-6">Status Breakdown</h3>
      
      {/* Simple pseudo donut representation using a flex bar for simplicity but preserving aesthetics */}
      <div className="h-4 w-full flex rounded-full overflow-hidden mb-8 gap-0.5 bg-surface-strong">
        {overview.statusBreakdown.map(st => {
          if (st.count === 0) return null;
          const percent = (st.count / totalTasks) * 100;
          return (
            <div 
              key={st.status} 
              className={`h-full ${statusColors[st.status] || 'bg-ink'}`}
              style={{ width: `${percent}%` }}
              title={`${st.status}: ${st.count}`}
            />
          );
        })}
      </div>

      <div className="flex flex-col gap-3 flex-1">
        {overview.statusBreakdown.map(st => {
          const percent = totalTasks > 0 ? Math.round((st.count / totalTasks) * 100) : 0;
          return (
            <div key={st.status} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${statusColors[st.status] || 'bg-ink'}`} />
                <span className="font-medium text-body capitalize">{st.status.replace('_', ' ').toLowerCase()}</span>
              </div>
              <div className="flex items-center gap-3 font-mono">
                <span className="text-ink font-semibold">{st.count}</span>
                <span className="text-muted w-8 text-right">{percent}%</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-hairline flex justify-between items-center">
        <span className="text-[11px] font-mono text-muted uppercase tracking-wider">Lifetime Logged</span>
        <span className="text-xs font-mono font-bold text-ink">
          {formatDuration(overview.totalLoggedTime.total_seconds)}
        </span>
      </div>
    </div>
  );
}
