import React from 'react';
import CustomTable, { type Column } from '../../../common/Ui/Table';
import type { AdminUserListItem } from '../types/users.types';
import ActionButton from '../../../common/Ui/Buttons/action.button';
import { Settings2 } from 'lucide-react';
import { formatDuration } from '../../../utils/formatters/FormatDuration';
import { format } from 'date-fns';

interface UsersTableProps {
  users: AdminUserListItem[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
  isLoading: boolean;
  onManage: (user: AdminUserListItem) => void;
}

export default function UsersTable({
  users,
  page,
  limit,
  total,
  totalPages,
  onPageChange,
  onLimitChange,
  isLoading,
  onManage
}: UsersTableProps) {
  const columns: Column<AdminUserListItem>[] = [
    {
      label: 'User',
      accessor: 'name',
      render: (_, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-strong text-ink flex items-center justify-center font-bold text-xs uppercase shadow-sm">
            {row.name.substring(0, 2)}
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-ink leading-tight">{row.name}</span>
            <span className="text-[11px] font-mono text-muted tracking-tight">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      label: 'Role',
      accessor: 'role',
      render: (value) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider ${value === 'ADMIN' ? 'bg-purple-500/10 text-purple-500' : 'bg-blue-500/10 text-blue-500'}`}>
          {value}
        </span>
      )
    },
    {
      label: 'Status',
      accessor: 'status',
      render: (value) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-medium uppercase tracking-wider ${value === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-error/10 text-error'}`}>
          {value}
        </span>
      )
    },
    {
      label: 'Platform Usage',
      accessor: 'total_tasks_created',
      render: (_, row) => (
        <div className="flex flex-col text-[11px] font-mono gap-0.5">
          <span className="text-ink">{row.total_tasks_created} Tasks</span>
          <span className="text-muted">{formatDuration(row.total_logged_seconds)} tracked</span>
        </div>
      )
    },
    {
      label: 'Last Login',
      accessor: 'last_login',
      render: (value) => (
        <span className="text-xs text-body font-mono">
          {value ? format(new Date(value as string), 'MMM dd, HH:mm') : 'Never'}
        </span>
      )
    },
    {
      label: 'Actions',
      accessor: 'id',
      render: (_, row) => (
        <div className="flex justify-end items-center">
          <ActionButton
            icon={<Settings2 size={14} />}
            title="Manage User"
            variant="ghost"
            onClick={() => onManage(row)}
          />
        </div>
      )
    }
  ];

  return (
    <div className="font-sans">
      <CustomTable
        column={columns}
        data={users}
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
