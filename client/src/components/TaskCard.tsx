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

const STATUS_BADGE_CLASSES: Record<TaskStatus, string> = {
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
    <div className={`bg-white border border-gray-200 rounded-lg overflow-hidden`}>
      <div className="flex justify-between items-start p-4 gap-3">
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span className="font-semibold text-[15px] text-gray-900">{task.title}</span>
          {task.description && (
            <span className="text-xs text-gray-500">{task.description}</span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <span
            className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide ${STATUS_BADGE_CLASSES[task.status]}`}
          >
            {STATUS_LABELS[task.status]}
          </span>
          <div className="flex gap-1.5">
            {canTransition && allowedNext.map((nextStatus) => (
              <button
                key={nextStatus}
                className="inline-flex items-center px-2.5 py-1 border border-gray-300 rounded text-xs bg-white hover:bg-gray-100 cursor-pointer transition-colors"
                onClick={() => onStatusChange(task.id, nextStatus)}
              >
                → {STATUS_LABELS[nextStatus]}
              </button>
            ))}
            <button
              className="inline-flex items-center px-2.5 py-1 border border-gray-300 rounded text-xs bg-transparent hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? '▲ Hide Log' : '▼ Audit Log'}
            </button>
            <button
              className="inline-flex items-center px-2.5 py-1 border border-red-300 rounded text-xs text-red-600 bg-transparent hover:bg-red-50 cursor-pointer transition-colors"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-gray-100 p-4 bg-gray-50">
          <h4 className="text-xs font-semibold mb-2 text-gray-500 uppercase tracking-widest">
            Audit Log
          </h4>
          {loading ? <p className="text-sm text-gray-400">Loading...</p> : <AuditLog logs={logs} />}
        </div>
      )}
    </div>
  );
}
