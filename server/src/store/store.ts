import { v4 as uuidv4 } from 'uuid';
import {
  Task,
  AuditLogEntry,
  TaskStatus,
  STATUS_ORDER,
} from '../types';

// ---------------------------------------------------------------------------
// In-memory store
// ---------------------------------------------------------------------------
const tasks = new Map<string, Task>();
const auditLogs: AuditLogEntry[] = [];

// ---------------------------------------------------------------------------
// Tasks
// ---------------------------------------------------------------------------
export function getAllTasks(): Task[] {
  return Array.from(tasks.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getTaskById(id: string): Task | undefined {
  return tasks.get(id);
}

export function createTask(title: string, description: string): Task {
  const now = new Date().toISOString();
  const task: Task = {
    id: uuidv4(),
    title,
    description,
    status: TaskStatus.TO_DO,
    createdAt: now,
    updatedAt: now,
  };
  tasks.set(task.id, task);
  return task;
}

export function updateTaskStatus(id: string, newStatus: TaskStatus): Task | null {
  const task = tasks.get(id);
  if (!task) return null;
  task.status = newStatus;
  task.updatedAt = new Date().toISOString();
  tasks.set(id, task);
  return task;
}

export function deleteTask(id: string): boolean {
  return tasks.delete(id);
}

// ---------------------------------------------------------------------------
// Audit logs
// ---------------------------------------------------------------------------
export function createAuditLog(
  taskId: string,
  actor: string,
  fromStatus: TaskStatus,
  toStatus: TaskStatus,
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: uuidv4(),
    taskId,
    actor,
    fromStatus,
    toStatus,
    timestamp: new Date().toISOString(),
  };
  auditLogs.push(entry);
  return entry;
}

export function getAuditLogsForTask(taskId: string): AuditLogEntry[] {
  return auditLogs
    .filter((e) => e.taskId === taskId)
    .sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
}

export function getAllAuditLogs(): AuditLogEntry[] {
  return [...auditLogs];
}
