import { useState } from 'react';

interface CreateTaskFormProps {
  onSubmit: (title: string, description: string) => Promise<unknown>;
}

export function CreateTaskForm({ onSubmit }: CreateTaskFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(title.trim(), description.trim());
      setTitle('');
      setDescription('');
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) {
    return (
      <button
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 cursor-pointer transition-colors"
        onClick={() => setOpen(true)}
      >
        + New Task
      </button>
    );
  }

  return (
    <form className="bg-white border border-gray-200 rounded-lg p-4 mb-4" onSubmit={handleSubmit}>
      <h3 className="text-base font-semibold mb-3">Create Task</h3>
      <div className="mb-2.5">
        <label htmlFor="task-title" className="block text-xs font-semibold mb-1 text-gray-700">
          Title *
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
          autoFocus
          className="w-full px-2.5 py-2 border border-gray-300 rounded text-sm font-inherit focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
      </div>
      <div className="mb-2.5">
        <label htmlFor="task-desc" className="block text-xs font-semibold mb-1 text-gray-700">
          Description
        </label>
        <textarea
          id="task-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
          rows={3}
          className="w-full px-2.5 py-2 border border-gray-300 rounded text-sm font-inherit resize-y focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        />
      </div>
      <div className="flex gap-2 mt-3">
        <button
          type="submit"
          disabled={submitting || !title.trim()}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          {submitting ? 'Creating...' : 'Create'}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="inline-flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-200 cursor-pointer transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
