import React, { useState } from 'react';
import CustomTable, { type Column } from '../../../common/Ui/Table';
import type { Task } from '../types/task.types';
import ActionButton from '../../../common/Ui/Buttons/action.button';
import { Eye, Edit3, Trash2, Clock, Play, Square } from 'lucide-react';
import { formatDuration } from '../../../utils/formatters/FormatDuration';
import { useTimeTrackMutations } from '../../timetrack/hooks/useTimeTrackMutations';
import { useTimerStore } from '../../../store/Timer/useTimerStore';

interface TaskTableProps {
  tasks: Task[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading: boolean;
  onEdit: (task: Task) => void;
  onView: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export default function TaskTable({
  tasks,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  isLoading,
  onEdit,
  onView,
  onDelete
}: TaskTableProps) {
  const { startTimer, stopTimer, isStarting, isStopping } = useTimeTrackMutations();
  const activeSession = useTimerStore(state => state.activeSession);
  const elapsedSeconds = useTimerStore(state => state.elapsedSeconds);

  const columns: Column<Task>[] = [
    {
      label: 'Task & ID',
      accessor: 'title',
      render: (value, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-ink leading-tight">{value}</span>
          <span className="text-[11px] font-mono text-muted tracking-tight">TRK-{row.id.substring(0,6).toUpperCase()}</span>
        </div>
      ),
    },
    {
      label: 'Status',
      accessor: 'status',
      render: (value) => {
        let colors = '';
        switch(value) {
          case 'COMPLETED': colors = 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'; break;
          case 'IN_PROGRESS': colors = 'bg-blue-500/10 text-blue-500 border border-blue-500/20'; break;
          default: colors = 'bg-surface-strong text-body border border-hairline-strong';
        }
        return (
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider ${colors}`}>
            {value === 'IN_PROGRESS' ? 'In Progress' : value}
          </span>
        );
      }
    },
    {
      label: 'Priority',
      accessor: 'priority',
      render: (value) => {
        let colors = '';
        switch(value) {
          case 'HIGH': colors = 'text-error bg-error/10'; break;
          case 'MEDIUM': colors = 'text-warning bg-warning/10'; break;
          default: colors = 'text-muted bg-surface-strong';
        }
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-semibold uppercase ${colors}`}>
            {value}
          </span>
        );
      }
    },
    {
      label: 'Logged',
      accessor: 'total_time_spent_seconds',
      render: (value, row) => {
        const isActive = activeSession?.task_id === row.id;
        const displaySeconds = isActive ? (value as number) + elapsedSeconds : (value as number);
        
        return (
          <div className={`font-mono text-xs font-medium flex items-center gap-1.5 ${isActive ? 'text-error font-bold' : 'text-ink'}`}>
            {isActive && <span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse" />}
            {formatDuration(displaySeconds)}
          </div>
        );
      }
    },
    {
      label: 'Actions',
      accessor: 'id',
      render: (_, row) => {
        const isActive = activeSession?.task_id === row.id;
        
        return (
          <div className="flex justify-end items-center gap-1">
            {isActive ? (
              <ActionButton
                icon={<Square size={14} />}
                title="Stop Timer"
                variant="danger"
                onClick={() => stopTimer({ payload: {} })}
                disabled={isStopping}
              />
            ) : (
              <ActionButton
                icon={<Play size={14} />}
                title="Start Timer"
                variant="success"
                onClick={() => startTimer({ payload: { taskId: row.id } })}
                disabled={isStarting}
              />
            )}
          <ActionButton
            icon={<Eye size={14} />}
            title="View Details"
            variant="ghost"
            onClick={() => onView(row)}
          />
          <ActionButton
            icon={<Edit3 size={14} />}
            title="Edit Task"
            variant="default"
            onClick={() => onEdit(row)}
          />
          <ActionButton
            icon={<Trash2 size={14} />}
            title="Delete Task"
            variant="danger"
            onClick={() => onDelete(row)}
          />
        </div>
        );
      }
    }
  ];

  return (
    <div className="font-sans">
      <CustomTable
        column={columns}
        data={tasks}
        page={page}
        limit={limit}
        totalItems={total}
        totalPages={totalPages}
        onPageChange={onPageChange}
        onLimitChange={onLimitChange}
        isFetching={isLoading}
      />
    </div>
  );
}
