import { useState, useEffect, useCallback } from 'react';
import { Task, AuditLogEntry, TaskStatus } from '../types';
import * as api from '../api';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.fetchTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof api.ApiError ? err.message : 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const addTask = async (title: string, description: string) => {
    const task = await api.createTask(title, description);
    await load();
    return task;
  };

  const changeStatus = async (id: string, status: TaskStatus, actor: string) => {
    const task = await api.updateTaskStatus(id, status, actor);
    setTasks((prev) => prev.map((t) => (t.id === id ? task : t)));
    return task;
  };

  const removeTask = async (id: string) => {
    await api.deleteTask(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return { tasks, loading, error, reload: load, addTask, changeStatus, removeTask };
}

export function useAuditLogs(taskId: string | null) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!taskId) {
      setLogs([]);
      return;
    }
    setLoading(true);
    api.fetchAuditLogs(taskId)
      .then(setLogs)
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, [taskId]);

  return { logs, loading };
}
