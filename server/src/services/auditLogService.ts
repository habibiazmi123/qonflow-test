import { AuditLogEntry, TaskStatus } from '../types';
import * as store from '../store';

export const auditLogService = {
  record(
    taskId: string,
    actor: string,
    fromStatus: TaskStatus,
    toStatus: TaskStatus,
  ): AuditLogEntry {
    return store.createAuditLog(taskId, actor, fromStatus, toStatus);
  },

  getForTask(taskId: string): AuditLogEntry[] {
    return store.getAuditLogsForTask(taskId);
  },
};
