import { Task, AuditLogEntry, TaskStatus } from './types';

const BASE_URL = '/api';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  const body = await res.json();

  if (!res.ok) {
    throw new ApiError(body.error?.message ?? 'Unknown error', body.error?.code ?? 'UNKNOWN', res.status);
  }

  return body.data as T;
}

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
  }
}

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------
export function fetchTasks(): Promise<Task[]> {
  return request<Task[]>('/tasks');
}

export function createTask(title: string, description: string): Promise<Task> {
  return request<Task>('/tasks', {
    method: 'POST',
    body: JSON.stringify({ title, description }),
  });
}

export function updateTaskStatus(id: string, status: TaskStatus, actor: string): Promise<Task> {
  return request<Task>(`/tasks/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status, actor }),
  });
}

export function deleteTask(id: string): Promise<void> {
  return request<void>(`/tasks/${id}`, { method: 'DELETE' });
}

// ---------------------------------------------------------------------------
// Audit Logs
// ---------------------------------------------------------------------------
export function fetchAuditLogs(taskId: string): Promise<AuditLogEntry[]> {
  return request<AuditLogEntry[]>(`/tasks/${taskId}/audit-logs`);
}
