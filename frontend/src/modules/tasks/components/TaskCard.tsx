import React from 'react';
import type{ Task } from '../types/task.types';
import ActionButton from '../../../common/Ui/Buttons/action.button';
import { Eye, Edit3, Trash2, Clock, Play, Square } from 'lucide-react';
import { formatDuration } from '../../../utils/formatters/FormatDuration';
import { useTimeTrackMutations } from '../../timetrack/hooks/useTimeTrackMutations';
import { useTimerStore } from '../../../store/Timer/useTimerStore';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onView: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskCard({ task, onEdit, onView, onDelete }: TaskCardProps) {
  const { startTimer, stopTimer, isStarting, isStopping } = useTimeTrackMutations();
  const activeSession = useTimerStore(state => state.activeSession);
  const elapsedSeconds = useTimerStore(state => state.elapsedSeconds);
  let statusColors = '';
  switch(task.status) {
    case 'COMPLETED': statusColors = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'; break;
    case 'IN_PROGRESS': statusColors = 'bg-blue-500/10 text-blue-500 border border-blue-500/20'; break;
    default: statusColors = 'bg-surface-strong text-body border border-hairline-strong';
  }

  let priorityColors = '';
  switch(task.priority) {
    case 'HIGH': priorityColors = 'text-error bg-error/10'; break;
    case 'MEDIUM': priorityColors = 'text-warning bg-warning/10'; break;
    default: priorityColors = 'text-muted bg-surface-strong';
  }

  return (
    <div className="bg-surface-card border border-hairline-strong rounded-xl p-4 flex flex-col gap-3 shadow-card-soft font-sans hover:border-ink/20 transition-colors">
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-mono text-muted tracking-tight">TRK-{task.id.substring(0,6).toUpperCase()}</span>
          <h4 className="text-sm font-semibold text-ink leading-tight line-clamp-2">{task.title}</h4>
        </div>
        <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[9px] font-semibold uppercase shrink-0 ${priorityColors}`}>
          {task.priority}
        </span>
      </div>

      <div className="text-xs text-muted line-clamp-2 mt-1 min-h-[32px]">
        {task.description || 'No description provided.'}
      </div>

      <div className="flex items-center justify-between mt-auto pt-3 border-t border-hairline">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider ${statusColors}`}>
          {task.status === 'IN_PROGRESS' ? 'In Progress' : task.status}
        </span>
        
        {(() => {
          const isActive = activeSession?.task_id === task.id;
          const displaySeconds = isActive ? (task.total_time_spent_seconds || 0) + elapsedSeconds : (task.total_time_spent_seconds || 0);
          
          return (
            <div className={`flex items-center gap-1.5 font-mono text-[11px] font-medium ${isActive ? 'text-error font-bold' : 'text-ink'}`}>
              {isActive ? (
                <span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse" />
              ) : (
                <Clock size={12} className="text-muted" />
              )}
              {formatDuration(displaySeconds)}
            </div>
          );
        })()}
      </div>

      <div className="flex items-center justify-between pt-3 mt-1 border-t border-hairline">
        {activeSession?.task_id === task.id ? (
          <ActionButton
            icon={<Square size={13} className="text-error" />}
            label="Stop"
            variant="danger"
            size="sm"
            disabled={isStopping}
            onClick={() => stopTimer({ payload: {} })}
          />
        ) : (
          <ActionButton
            icon={<Play size={13} className="text-emerald-500" />}
            label="Track"
            variant="ghost"
            size="sm"
            disabled={isStarting}
            onClick={() => startTimer({ payload: { taskId: task.id } })}
          />
        )}
        <div className="flex items-center gap-1">
          <ActionButton icon={<Eye size={13} />} variant="ghost" size="sm" onClick={() => onView(task)} />
          <ActionButton icon={<Edit3 size={13} />} variant="ghost" size="sm" onClick={() => onEdit(task)} />
          <ActionButton icon={<Trash2 size={13} />} variant="danger" size="sm" onClick={() => onDelete(task)} />
        </div>
      </div>
    </div>
  );
}
