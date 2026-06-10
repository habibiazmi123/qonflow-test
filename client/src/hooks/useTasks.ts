import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Task, AuditLogEntry, TaskStatus } from '../types';
import * as api from '../api';

// ---------------------------------------------------------------------------
// Query key factory
// ---------------------------------------------------------------------------
export const queryKeys = {
  tasks: ['tasks'] as const,
  auditLogs: (taskId: string) => ['auditLogs', taskId] as const,
};

// ---------------------------------------------------------------------------
// Tasks hook
// ---------------------------------------------------------------------------
export function useTasks() {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, error } = useQuery<Task[]>({
    queryKey: queryKeys.tasks,
    queryFn: api.fetchTasks,
  });

  const addMutation = useMutation({
    mutationFn: ({ title, description }: { title: string; description: string }) =>
      api.createTask(title, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status, actor }: { id: string; status: TaskStatus; actor: string }) =>
      api.updateTaskStatus(id, status, actor),
    onSuccess: (_, variables) => {
      // Invalidate both tasks list and audit logs for this task
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
      queryClient.invalidateQueries({ queryKey: queryKeys.auditLogs(variables.id) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tasks });
    },
  });

  return {
    tasks,
    loading: isLoading,
    error: error?.message ?? null,
    addTask: (title: string, description: string) =>
      addMutation.mutateAsync({ title, description }),
    changeStatus: (id: string, status: TaskStatus, actor: string) =>
      statusMutation.mutateAsync({ id, status, actor }),
    removeTask: (id: string) => deleteMutation.mutateAsync(id),
  };
}

// ---------------------------------------------------------------------------
// Audit logs hook
// ---------------------------------------------------------------------------
export function useAuditLogs(taskId: string | null) {
  const { data: logs = [], isLoading } = useQuery<AuditLogEntry[]>({
    queryKey: queryKeys.auditLogs(taskId ?? ''),
    queryFn: () => api.fetchAuditLogs(taskId!),
    enabled: !!taskId,
  });

  return { logs, loading: isLoading };
}
