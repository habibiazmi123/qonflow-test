import { useState } from 'react';
import { Actor, PREDEFINED_ACTORS, TaskStatus } from './types';
import { ActorSelector } from './components/ActorSelector';
import { CreateTaskForm } from './components/CreateTaskForm';
import { TaskList } from './components/TaskList';
import { useTasks } from './hooks/useTasks';

function getInitialActor(): Actor {
  const stored = localStorage.getItem('actor');
  if (stored && (PREDEFINED_ACTORS as readonly string[]).includes(stored)) {
    return stored as Actor;
  }
  return PREDEFINED_ACTORS[0];
}

export default function App() {
  const [actor, setActor] = useState<Actor>(getInitialActor);
  const { tasks, loading, error, addTask, changeStatus, removeTask } = useTasks();

  const handleActorChange = (newActor: Actor) => {
    setActor(newActor);
    localStorage.setItem('actor', newActor);
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    try {
      await changeStatus(id, status, actor);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await removeTask(id);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete task');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-on-surface font-body-md">
      {/* ========== TopNavBar ========== */}
      <nav className="bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center w-full px-6 h-16 shrink-0">
        <span className="text-headline-md font-bold text-primary">TaskCore</span>
        <ActorSelector actor={actor} onChange={handleActorChange} />
      </nav>

      {/* ========== Main Content ========== */}
      <main className="flex-1 bg-surface-container-low">
        <div className="max-w-3xl mx-auto px-6 py-8">
          {error && (
            <div className="flex items-center gap-3 px-4 py-3 mb-6 bg-error-container border border-error/30 rounded-lg text-body-sm text-on-error-container">
              <span className="material-symbols-outlined text-body-md">error</span>
              {error}
            </div>
          )}

          {/* Create Task button above the list */}
          <div className="mb-6">
            <CreateTaskForm onSubmit={addTask} />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <span className="text-body-md text-on-surface-variant">Loading tasks...</span>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>
    </div>
  );
}
