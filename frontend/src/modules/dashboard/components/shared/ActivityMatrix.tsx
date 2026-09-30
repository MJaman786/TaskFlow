import React, { useMemo } from 'react';
import { Flame, Calendar as CalendarIcon } from 'lucide-react';
import type { ActivityMatrixData } from '../../types/dashboard.types';
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';

interface ActivityMatrixProps {
  matrix: ActivityMatrixData;
}

export default function ActivityMatrix({ matrix }: ActivityMatrixProps) {
  
  // Generate calendar data for months of the current year (up to current month)
  const currentYear = matrix.year || new Date().getFullYear();
  const currentMonthIdx = new Date().getMonth(); // 0 to 11

  const monthsData = useMemo(() => {
    const months = [];
    for (let month = 0; month <= currentMonthIdx; month++) {
      const dateInMonth = new Date(currentYear, month, 1);
      const start = startOfMonth(dateInMonth);
      const end = endOfMonth(dateInMonth);
      const days = eachDayOfInterval({ start, end });
      const startingDayOfWeek = getDay(start); // 0 (Sun) to 6 (Sat)
      
      months.push({
        name: format(start, 'MMMM'),
        totalDays: days.length,
        startingDayOfWeek,
        days: days.map(d => {
          const contrib = matrix.dailyContributions.find(c => isSameDay(parseISO(c.date), d));
          return {
            date: d,
            dayOfMonth: format(d, 'd'),
            intensity: contrib?.intensity || '0 (Blank)'
          };
        })
      });
    }
    return months;
  }, [currentYear, currentMonthIdx, matrix.dailyContributions]);

  const getIntensityClasses = (intensity: string) => {
    switch (intensity) {
      case '1-5': return 'bg-emerald-500/20 text-emerald-700 font-bold';
      case '6-10': return 'bg-emerald-500 text-white font-bold';
      case '10+': return 'bg-emerald-800 text-white font-bold';
      case '0 (Blank)':
      default: return 'text-muted font-medium hover:bg-surface-strong';
    }
  };

  const getLegendColor = (intensity: string) => {
    switch (intensity) {
      case '1-5': return 'bg-emerald-500/20 border border-emerald-500/30';
      case '6-10': return 'bg-emerald-500 border border-emerald-600';
      case '10+': return 'bg-emerald-800 border border-emerald-900';
      case '0 (Blank)':
      default: return 'bg-surface-soft border border-hairline-strong';
    }
  };

  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-surface-card border border-hairline-strong rounded-xl p-5 shadow-card-soft font-sans overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-emerald-500/10 rounded-md text-emerald-600">
            <CalendarIcon size={18} />
          </div>
          <h3 className="text-lg font-bold text-ink font-poppins">Annual Activity Matrix</h3>
          <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 text-[11px] font-mono font-semibold">
            {matrix.totalContributions} Contributions
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 text-[11px] font-bold tracking-wide">
            <Flame size={14} className="fill-orange-500/20" />
            {matrix.streaks.daysActive} Days Active
          </div>
          <div className="text-xs font-semibold text-ink bg-surface-strong px-3 py-1 rounded-md flex items-center gap-2">
            {matrix.year} 
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>

      <p className="text-xs text-muted mb-6">Daily algorithmic commits and solution saves tracked across {matrix.year}.</p>

      {/* Calendars Container */}
      <div className="flex gap-4 overflow-x-auto custom-scrollbar pb-4 -mx-1 px-1">
        {monthsData.map((month, mIdx) => (
          <div key={mIdx} className="flex-none bg-surface-soft/40 border border-hairline rounded-xl p-4 min-w-[220px]">
            {/* Month Header */}
            <div className="flex justify-between items-baseline mb-4">
              <span className="font-bold text-ink text-sm">{month.name}</span>
              <span className="text-[10px] font-mono text-muted">{month.totalDays}d</span>
            </div>
            
            {/* Day Names */}
            <div className="grid grid-cols-7 gap-y-2 gap-x-1 mb-2">
              {dayNames.map((day, dIdx) => (
                <div key={dIdx} className="text-center text-[9px] font-mono font-medium text-muted/60">
                  {day}
                </div>
              ))}
              
              {/* Empty padding days */}
              {Array.from({ length: month.startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="text-center text-[10px] p-1" />
              ))}
              
              {/* Actual Days */}
              {month.days.map((day, dIdx) => (
                <div 
                  key={dIdx} 
                  title={`${format(day.date, 'MMM dd, yyyy')} - ${day.intensity}`}
                  className={`aspect-square flex items-center justify-center text-[10px] rounded-full transition-colors cursor-pointer ${getIntensityClasses(day.intensity)}`}
                >
                  {day.dayOfMonth}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Footer / Legend */}
      <div className="mt-4 pt-4 border-t border-hairline flex items-center justify-between">
        {/* Intensity Legend */}
        <div className="flex items-center gap-3 text-[10px] font-mono text-muted">
          <span className="font-semibold text-body">Intensity:</span>
          
          <div className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${getLegendColor('0 (Blank)')}`} />
            <span>0 (Blank)</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${getLegendColor('1-5')}`} />
            <span>1-5</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${getLegendColor('6-10')}`} />
            <span>6-10</span>
          </div>
          
          <div className="flex items-center gap-1.5">
            <div className={`w-3 h-3 rounded-full ${getLegendColor('10+')}`} />
            <span>10+</span>
          </div>
        </div>

        {/* Best Streak */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted uppercase tracking-tight">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-body"><path d="M12 20v-6M6 20V10M18 20V4"/></svg>
          Best Streak: <span className="font-bold text-ink tracking-normal">{matrix.streaks.longestStreak} Days</span>
        </div>
      </div>
    </div>
  );
}
