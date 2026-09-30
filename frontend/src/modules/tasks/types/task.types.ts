export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  total_time_spent_seconds: number;
  has_active_timer: boolean;
}

// Request Payloads
export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  due_date?: string | null;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  dueDate?: string | null;
  due_date?: string | null;
}

export interface TaskQueryParams {
  page?: number;
  limit?: number;
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
}

export interface NlpSuggestPayload {
  input: string;
}

// API Response Shapes
export interface TasksResponseData {
  tasks: Task[];
}

export interface SingleTaskResponseData {
  task: Task;
}

export interface NlpSuggestResponseData {
  rawInput: string;
  suggestedTitle: string;
  suggestedDescription: string;
  suggestedPriority: TaskPriority;
}