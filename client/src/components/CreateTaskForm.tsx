import { useState, useRef, useEffect } from 'react';

interface CreateTaskFormProps {
  onSubmit: (title: string, description: string) => Promise<unknown>;
}

export function CreateTaskForm({ onSubmit }: CreateTaskFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open]);

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

  return (
    <>
      {/* Trigger Button */}
      <button
        className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <span className="material-symbols-outlined">add</span>
        Create Task
      </button>

      {/* Modal Overlay */}
      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={(e) => { if (e.target === overlayRef.current) setOpen(false); }}
        >
          {/* Modal Panel */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <h2 className="text-headline-sm text-primary font-semibold">New Task</h2>
              <button
                className="p-1.5 text-secondary hover:bg-surface-container-low rounded-lg transition-all cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 pb-6 pt-2">
              <div className="mb-4">
                <label htmlFor="task-title" className="block text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold mb-1.5">
                  Title *
                </label>
                <input
                  id="task-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Prepare Q1 Invoice"
                  required
                  autoFocus
                  className="w-full px-3 py-2.5 border border-outline-variant rounded-lg text-body-md font-inherit bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="mb-6">
                <label htmlFor="task-desc" className="block text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold mb-1.5">
                  Description
                </label>
                <textarea
                  id="task-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={3}
                  className="w-full px-3 py-2.5 border border-outline-variant rounded-lg text-body-md font-inherit bg-surface resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting || !title.trim()}
                  className="flex-1 py-2.5 bg-primary text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
                >
                  {submitting ? 'Creating...' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-5 py-2.5 border border-outline-variant text-secondary font-semibold rounded-lg hover:bg-surface-container-low transition-all cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
