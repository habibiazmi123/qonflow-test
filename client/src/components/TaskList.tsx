import { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

export function TaskList({ tasks, onStatusChange, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-5">
          <span className="material-symbols-outlined text-3xl text-outline">checklist</span>
        </div>
        <p className="text-body-md text-on-surface-variant font-medium mb-1">
          No tasks yet
        </p>
        <p className="text-body-sm text-on-surface-variant/60">
          Create one to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
