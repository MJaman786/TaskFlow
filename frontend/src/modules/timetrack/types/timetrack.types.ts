export interface TimeLog {
  id: string;
  user_id: string;
  task_id: string;
  start_time: string;
  end_time: string | null;
  duration_seconds: number;
  is_running: boolean;
  created_at: string;
  updated_at?: string;
  task_title?: string;
  task_status?: string;
  task_priority?: string;
}

export interface ActiveTimerSession {
  id: string;
  user_id: string;
  task_id: string;
  start_time: string;
  is_running: boolean;
  task_title: string;
  task_status: string;
  task_priority: string;
  currentElapsedSeconds: number;
}

// Request Payloads
export interface StartTimerPayload {
  taskId: string;
}

export interface StopTimerPayload {
  logId?: string;
}

export interface ManualLogPayload {
  taskId: string;
  startTime: string; // ISO 8601
  endTime: string;   // ISO 8601
}

export interface TimeLogQueryParams {
  page?: number;
  limit?: number;
  taskId?: string;
  from?: string; // ISO Date String
  to?: string;   // ISO Date String
}

// API Response Data Shapes (res.data)
export interface ActiveTimerResponseData {
  activeTimer: ActiveTimerSession | null;
}

export interface StartTimerResponseData {
  session: TimeLog & {
    taskTitle: string;
  };
}

export interface StopTimerResponseData {
  session: TimeLog & {
    totalTaskSeconds: number;
  };
}

export interface ManualLogResponseData {
  log: TimeLog;
}

export interface TimeLogsResponseData {
  timeLogs: TimeLog[];
}