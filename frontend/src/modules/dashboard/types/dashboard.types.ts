import type { TaskPriority, TaskStatus } from '../../tasks/types/task.types';
import type { ActiveTimerSession } from '../../timetrack/types/timetrack.types';

export type ActivityIntensity = '0 (Blank)' | '1-5' | '6-10' | '10+';

export interface DailyTaskWorkedOn {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  time_spent_today_seconds: number;
}

export interface DailySummary {
  date: string;
  totalTimeTrackedSeconds: number;
  totalTimeTrackedMinutes: number;
  totalSessionsToday: number;
  tasksWorkedOn: DailyTaskWorkedOn[];
  completedTasksCount: number;
  inProgressTasksCount: number;
  pendingTasksCount: number;
  totalTasksCount: number;
  activeTimer: ActiveTimerSession | null;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  daysActive: number;
}

export interface DailyContribution {
  date: string; // YYYY-MM-DD
  sessionCount: number;
  totalSeconds: number;
  totalMinutes: number;
  intensity: ActivityIntensity;
}

export interface ActivityMatrixData {
  year: number;
  totalContributions: number;
  streaks: StreakInfo;
  dailyContributions: DailyContribution[];
}

export interface StatusCountItem {
  status: TaskStatus;
  count: number;
}

export interface PriorityCountItem {
  priority: TaskPriority;
  count: number;
}

export interface LifetimeLoggedTime {
  total_seconds: number;
  total_hours: number;
}

export interface TaskOverviewData {
  statusBreakdown: StatusCountItem[];
  priorityBreakdown: PriorityCountItem[];
  totalLoggedTime: LifetimeLoggedTime;
}

export interface ConsolidatedDashboardData {
  dailySummary: DailySummary;
  activityMatrix: ActivityMatrixData;
  taskOverview: TaskOverviewData;
}

// Request Query Parameters
export interface DashboardQueryParams {
  year?: number;
}

export interface ActivityMatrixQueryParams {
  year?: number;
}

// API Response Shapes (res.data)
export interface DailySummaryResponseData {
  summary: DailySummary;
}

export interface ActivityMatrixResponseData extends ActivityMatrixData {}

export interface TaskOverviewResponseData extends TaskOverviewData {}

export interface ConsolidatedDashboardResponseData extends ConsolidatedDashboardData {}