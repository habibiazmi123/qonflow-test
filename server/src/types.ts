export enum TaskStatus {
  TO_DO = 'to_do',
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

export const STATUS_ORDER: Record<TaskStatus, number> = {
  [TaskStatus.TO_DO]: 0,
  [TaskStatus.PENDING]: 1,
  [TaskStatus.IN_PROGRESS]: 2,
  [TaskStatus.DONE]: 3,
};

export const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  [TaskStatus.TO_DO]: [TaskStatus.PENDING],
  [TaskStatus.PENDING]: [TaskStatus.IN_PROGRESS],
  [TaskStatus.IN_PROGRESS]: [TaskStatus.DONE],
  [TaskStatus.DONE]: [],
};

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  taskId: string;
  actor: string;
  fromStatus: TaskStatus;
  toStatus: TaskStatus;
  timestamp: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
}

export interface UpdateStatusPayload {
  status: TaskStatus;
  actor: string;
}

export const PREDEFINED_ACTORS = ['john.doe', 'jane.smith', 'bob.wilson'] as const;

export type Actor = (typeof PREDEFINED_ACTORS)[number];
