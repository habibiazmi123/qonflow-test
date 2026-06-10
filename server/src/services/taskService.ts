import {
  CreateTaskPayload,
  UpdateStatusPayload,
  Task,
  TaskStatus,
  VALID_TRANSITIONS,
} from '../types';
import * as store from '../store';
import { auditLogService } from './auditLogService';

export const taskService = {
  list(): Task[] {
    return store.getAllTasks();
  },

  getById(id: string): Task | null {
    const task = store.getTaskById(id);
    return task ?? null;
  },

  create(payload: CreateTaskPayload): Task {
    if (!payload.title || payload.title.trim().length === 0) {
      throw new ValidationError('Title is required');
    }
    return store.createTask(payload.title.trim(), payload.description?.trim() ?? '');
  },

  updateStatus(id: string, payload: UpdateStatusPayload): Task {
    const task = store.getTaskById(id);
    if (!task) {
      throw new NotFoundError(`Task ${id} not found`);
    }

    if (!payload.actor || payload.actor.trim().length === 0) {
      throw new ValidationError('Actor is required');
    }

    const currentStatus = task.status;
    const newStatus = payload.status;

    // Idempotent: same status → no-op, no audit log
    if (currentStatus === newStatus) {
      return task;
    }

    // Validate transition
    const allowed = VALID_TRANSITIONS[currentStatus];
    if (!allowed.includes(newStatus)) {
      throw new ValidationError(
        `Cannot transition from "${currentStatus}" to "${newStatus}". ` +
        `Allowed transitions from "${currentStatus}": ${allowed.map((s) => `"${s}"`).join(', ') || 'none'}.`,
      );
    }

    const updated = store.updateTaskStatus(id, newStatus);
    if (!updated) {
      throw new Error(`Failed to update task ${id}`);
    }

    // Record audit log
    auditLogService.record(id, payload.actor, currentStatus, newStatus);

    return updated;
  },

  remove(id: string): void {
    const task = store.getTaskById(id);
    if (!task) {
      throw new NotFoundError(`Task ${id} not found`);
    }
    store.deleteTask(id);
  },
};

// ---------------------------------------------------------------------------
// Typed errors
// ---------------------------------------------------------------------------
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}
