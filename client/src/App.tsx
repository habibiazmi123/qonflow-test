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
    <div className="max-w-3xl mx-auto p-6">
      <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">Mini Task Manager</h1>
        <ActorSelector actor={actor} onChange={handleActorChange} />
      </header>

      <main>
        <div className="mb-4">
          <CreateTaskForm onSubmit={addTask} />
        </div>

        {error && (
          <p className="bg-red-50 text-red-600 px-3.5 py-2.5 rounded-md border border-red-300 mb-4 text-sm">
            {error}
          </p>
        )}

        {loading ? (
          <p className="text-gray-500 text-sm">Loading tasks...</p>
        ) : (
          <TaskList
            tasks={tasks}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        )}
      </main>
    </div>
  );
}
