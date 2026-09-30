import React from 'react';
import CustomTable, { type Column } from '../../../common/Ui/Table';
import type { TimeLog } from '../types/timetrack.types';
import ActionButton from '../../../common/Ui/Buttons/action.button';
import { Eye, Trash2 } from 'lucide-react';
import { formatDuration } from '../../../utils/formatters/FormatDuration';
import { format } from 'date-fns';
import { useTimerStore } from '../../../store/Timer/useTimerStore';

interface TimeLogTableProps {
  logs: TimeLog[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading: boolean;
  onView: (log: TimeLog) => void;
  onDelete?: (log: TimeLog) => void;
}

export default function TimeLogTable({
  logs,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  isLoading,
  onView,
  onDelete
}: TimeLogTableProps) {
  const elapsedSeconds = useTimerStore(state => state.elapsedSeconds);

  const columns: Column<TimeLog>[] = [
    {
      label: 'Task Logged',
      accessor: 'task_title',
      render: (_, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-ink leading-tight">{row.task_title || 'Unknown Task'}</span>
          <span className="text-[11px] font-mono text-muted tracking-tight">TRK-{row.task_id?.substring(0,6).toUpperCase()}</span>
        </div>
      ),
    },
    {
      label: 'Date',
      accessor: 'start_time',
      render: (value) => (
        <span className="text-xs text-body">
          {format(new Date(value as string), 'MMM dd, yyyy')}
        </span>
      )
    },
    {
      label: 'Time Block',
      accessor: 'start_time',
      render: (_, row) => {
        const start = format(new Date(row.start_time), 'HH:mm');
        const end = row.end_time ? format(new Date(row.end_time), 'HH:mm') : 'Active';
        return (
          <span className="text-[11px] font-mono text-muted bg-surface-strong px-2 py-0.5 rounded-sm">
            {start} - {end}
          </span>
        );
      }
    },
    {
      label: 'Duration',
      accessor: 'duration_seconds',
      render: (value, row) => {
        const isRunning = row.is_running;
        const displaySeconds = isRunning ? (value as number) + elapsedSeconds : (value as number);
        return (
          <div className={`font-mono text-xs font-bold flex items-center gap-1.5 ${isRunning ? 'text-error' : 'text-ink'}`}>
            {isRunning && <span className="w-1.5 h-1.5 bg-error rounded-full animate-pulse" />}
            {formatDuration(displaySeconds)}
          </div>
        );
      }
    },
    {
      label: 'Actions',
      accessor: 'id',
      render: (_, row) => (
        <div className="flex justify-end items-center gap-1">
          <ActionButton
            icon={<Eye size={14} />}
            title="View Details"
            variant="ghost"
            onClick={() => onView(row)}
          />
          {onDelete && !row.is_running && (
            <ActionButton
              icon={<Trash2 size={14} />}
              title="Delete Log"
              variant="danger"
              onClick={() => onDelete(row)}
            />
          )}
        </div>
      )
    }
  ];

  return (
    <div className="font-sans">
      <CustomTable
        column={columns}
        data={logs}
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
