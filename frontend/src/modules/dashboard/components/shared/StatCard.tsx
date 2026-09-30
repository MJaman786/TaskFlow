import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  progress?: {
    value: number; // 0 to 100
    label?: string;
  };
}

export default function StatCard({ title, value, subtitle, icon, trend, progress }: StatCardProps) {
  return (
    <div className="bg-surface-card border border-hairline-strong rounded-xl p-5 flex flex-col gap-3 shadow-card-soft font-sans">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium text-muted uppercase tracking-wider">{title}</h3>
        {icon && <div className="text-muted">{icon}</div>}
      </div>

      <div className="flex items-end gap-3">
        <span className="text-2xl font-poppins font-bold text-ink leading-none tracking-tight">{value}</span>
        {trend && (
          <span className={`text-[11px] font-mono font-medium mb-1 ${trend.isPositive !== false ? 'text-emerald-500' : 'text-error'}`}>
            {trend.isPositive !== false ? '↗' : '↘'} {trend.value}%
          </span>
        )}
      </div>
      
      {subtitle && (
        <p className="text-xs text-muted">{subtitle}</p>
      )}

      {progress && (
        <div className="mt-auto pt-4 flex flex-col gap-1.5">
          <div className="flex justify-between items-center text-[10px] font-mono text-muted">
            <span>{progress.label || 'Progress'}</span>
            <span>{progress.value}%</span>
          </div>
          <div className="h-1.5 w-full bg-surface-strong rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, progress.value))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
