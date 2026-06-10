import { useState } from 'react';
import { Task, TaskStatus, VALID_TRANSITIONS } from '../types';
import { AuditLog } from './AuditLog';
import { useAuditLogs } from '../hooks/useTasks';

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  [TaskStatus.TO_DO]: 'To Do',
  [TaskStatus.PENDING]: 'Pending',
  [TaskStatus.IN_PROGRESS]: 'In Progress',
  [TaskStatus.DONE]: 'Done',
};

const STATUS_PILL_CLASSES: Record<TaskStatus, string> = {
  [TaskStatus.TO_DO]: 'bg-status-to-do text-status-to-do-text',
  [TaskStatus.PENDING]: 'bg-status-pending text-status-pending-text',
  [TaskStatus.IN_PROGRESS]: 'bg-status-in-progress text-status-in-progress-text',
  [TaskStatus.DONE]: 'bg-status-done text-status-done-text',
};

export function TaskCard({ task, onStatusChange, onDelete }: TaskCardProps) {
  const [expanded, setExpanded] = useState(false);
  const { logs, loading } = useAuditLogs(expanded ? task.id : null);

  const allowedNext = VALID_TRANSITIONS[task.status];
  const canTransition = allowedNext.length > 0;

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden transition-all hover:shadow-sm">
      {/* Card Header */}
      <div className="flex justify-between items-start p-card-padding gap-3">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-body-lg text-primary">{task.title}</span>
            <span
              className={`status-pill text-label-sm font-semibold ${STATUS_PILL_CLASSES[task.status]}`}
            >
              {STATUS_LABELS[task.status]}
            </span>
          </div>
          {task.description && (
            <span className="text-body-sm text-on-surface-variant mt-0.5">{task.description}</span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {canTransition && allowedNext.map((nextStatus) => (
            <button
              key={nextStatus}
              className="inline-flex items-center px-2.5 py-1.5 border border-outline-variant rounded text-label-sm bg-surface hover:bg-surface-container-low text-secondary font-semibold cursor-pointer transition-all active:scale-95"
              onClick={() => onStatusChange(task.id, nextStatus)}
              title={`Move to ${STATUS_LABELS[nextStatus]}`}
            >
              → {STATUS_LABELS[nextStatus]}
            </button>
          ))}
          <button
            className="inline-flex items-center px-2.5 py-1.5 border border-outline-variant rounded text-label-sm bg-surface hover:bg-surface-container-low text-secondary cursor-pointer transition-all active:scale-95"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="material-symbols-outlined text-body-sm mr-1">
              {expanded ? 'expand_less' : 'history'}
            </span>
            {expanded ? 'Hide' : 'Audit'}
          </button>
          <button
            className="inline-flex items-center px-2.5 py-1.5 border border-red-200 rounded text-label-sm text-error bg-surface hover:bg-error-container/30 cursor-pointer transition-all active:scale-95"
            onClick={() => onDelete(task.id)}
            title="Delete task"
          >
            <span className="material-symbols-outlined text-body-sm">delete</span>
          </button>
        </div>
      </div>

      {/* Audit Log Section */}
      {expanded && (
        <div className="border-t border-outline-variant p-card-padding bg-surface-container-low">
          <h4 className="text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold mb-4 flex items-center gap-2">
            <span className="material-symbols-outlined text-body-sm">history</span>
            Audit Log
          </h4>
          {loading ? (
            <p className="text-body-sm text-on-surface-variant">Loading...</p>
          ) : (
            <AuditLog logs={logs} />
          )}
        </div>
      )}
    </div>
  );
}
