import React from 'react';
import { useDashboard } from '../../hooks/useDashboard';
import StatCard from '../shared/StatCard';
import StreakCounter from '../shared/StreakCounter';
import ActivityMatrix from '../shared/ActivityMatrix';
import { Clock, CheckCircle2, ListTodo } from 'lucide-react';
import { formatDuration } from '../../../../utils/formatters/FormatDuration';
import Spinner from '../../../../common/Spinner';

export default function UserDashboard() {
  const { data: res, isLoading } = useDashboard({});

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <Spinner />
      </div>
    );
  }

  const dashboardData = res?.data;
  if (!dashboardData) return null;

  const { dailySummary, activityMatrix, taskOverview } = dashboardData;

  const progressValue = dailySummary.totalTasksCount > 0 
    ? Math.round((dailySummary.completedTasksCount / dailySummary.totalTasksCount) * 100) 
    : 0;

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Top row: Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Time Today"
          value={formatDuration(dailySummary.totalTimeTrackedSeconds)}
          icon={<Clock size={16} />}
          progress={{ value: Math.min(100, (dailySummary.totalTimeTrackedSeconds / (8 * 3600)) * 100), label: 'Target 8h' }}
        />
        <StatCard
          title="Tasks Completed"
          value={`${dailySummary.completedTasksCount} / ${dailySummary.totalTasksCount}`}
          icon={<CheckCircle2 size={16} />}
          progress={{ value: progressValue, label: `${dailySummary.inProgressTasksCount} in progress` }}
        />
        <StreakCounter streakInfo={activityMatrix.streaks} />
      </div>

      {/* Middle row: Activity Matrix & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityMatrix matrix={activityMatrix} />
        </div>
        
        <div className="bg-surface-card border border-hairline-strong rounded-xl p-5 shadow-card-soft flex flex-col">
          <h3 className="text-base font-bold text-ink font-poppins mb-4 flex items-center gap-2">
            <ListTodo size={18} className="text-muted" />
            Today's Active Tasks
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3">
            {dailySummary.tasksWorkedOn.length > 0 ? (
              dailySummary.tasksWorkedOn.map(task => (
                <div key={task.id} className="flex items-center justify-between p-3 border border-hairline rounded-lg hover:border-ink/20 transition-colors">
                  <div className="flex flex-col gap-1 overflow-hidden pr-2">
                    <span className="text-sm font-semibold text-ink truncate">{task.title}</span>
                    <span className="text-[10px] font-mono text-muted">TRK-{task.id.substring(0,6).toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-xs font-mono font-bold text-ink">
                      {formatDuration(task.time_spent_today_seconds)}
                    </span>
                    <span className={`text-[9px] font-mono font-medium uppercase px-1.5 py-0.5 rounded-sm ${task.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-surface-strong text-muted'}`}>
                      {task.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-muted gap-2">
                <span className="text-sm font-medium text-ink">No tasks logged today</span>
                <span className="text-xs text-center">Start a timer from the Tasks page to see activity here.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
