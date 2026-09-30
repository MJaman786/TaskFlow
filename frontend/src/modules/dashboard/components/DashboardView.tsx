import React from 'react';
import UserDashboard from './roles/UserDashboard';
import { useAuthStore } from '../../../store/Auth/useAuthStore';
import ActiveTimerBar from '../../timetrack/components/ActiveTimerBar';

export default function DashboardView() {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="w-full h-full flex flex-col font-sans p-6 animate-fadeIn">
      
      {/* Global Timer Bar */}
      <ActiveTimerBar />

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-muted uppercase tracking-wider">
              Telemetry Daemon Connected
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-sm bg-emerald-500/10 text-emerald-500 text-[9px] font-mono uppercase">
              • v2.4.9-prod
            </span>
          </div>
          <h1 className="text-2xl font-bold text-ink font-poppins capitalize">
            {user?.role === 'ADMIN' ? 'Admin Dashboard' : 'Developer Dashboard'}
          </h1>
          <p className="text-sm text-muted mt-0.5">
            Engineering pulse, active sprint metrics, and continuous commit telemetry.
          </p>
        </div>
      </div>

      <div className="flex-1 mt-2">
        <UserDashboard />
      </div>
    </div>
  );
}
