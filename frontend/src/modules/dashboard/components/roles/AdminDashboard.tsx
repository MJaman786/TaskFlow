import React from 'react';

export default function AdminDashboard() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] border border-dashed border-hairline-strong rounded-xl bg-surface-card p-6 text-center font-sans">
      <div className="w-12 h-12 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mb-4">
        {/* Shield icon placeholder */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
      </div>
      <h2 className="text-lg font-bold text-ink mb-2">Admin Workspace</h2>
      <p className="text-sm text-muted max-w-md">
        Welcome to the administrator dashboard. User management and platform telemetry features are available in the Admin Console (Phase 5).
      </p>
    </div>
  );
}
