import React from 'react';
import type { AdminPlatformStats } from '../types/users.types';
import { Users, Clock, CheckCircle2, ShieldAlert } from 'lucide-react';
import { formatDuration } from '../../../utils/formatters/FormatDuration';
import StatCard from '../../dashboard/components/shared/StatCard';

interface AdminStatsBannerProps {
  stats: AdminPlatformStats;
}

export default function AdminStatsBanner({ stats }: AdminStatsBannerProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 font-sans">
      <StatCard
        title="Total Users"
        value={stats.total_users}
        icon={<Users size={16} />}
        subtitle={`${stats.active_users} active • ${stats.suspended_users} suspended`}
      />
      <StatCard
        title="Total Tracked Time"
        value={formatDuration(stats.total_seconds_tracked)}
        icon={<Clock size={16} />}
        subtitle={`${stats.total_hours_tracked} hours accumulated`}
      />
      <StatCard
        title="Total Tasks Completed"
        value={stats.completed_tasks}
        icon={<CheckCircle2 size={16} />}
        progress={{ value: stats.total_tasks > 0 ? (stats.completed_tasks / stats.total_tasks) * 100 : 0, label: 'Completion Rate' }}
      />
      <StatCard
        title="Active Timers Running"
        value={stats.active_timers_running}
        icon={<ShieldAlert size={16} className="text-emerald-500 animate-pulse" />}
        subtitle="Across all users"
      />
    </div>
  );
}
