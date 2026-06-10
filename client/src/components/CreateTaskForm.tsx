import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().optional().default(''),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateTaskFormProps {
  onSubmit: (title: string, description: string) => Promise<unknown>;
}

export function CreateTaskForm({ onSubmit }: CreateTaskFormProps) {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(formSchema) as any,
    defaultValues: { title: '', description: '' },
  });

  useEffect(() => {
    if (!open) return;
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [open]);

  const submit = async (data: FormValues) => {
    setSubmitting(true);
    try {
      await onSubmit(data.title, data.description ?? '');
      reset();
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <span className="material-symbols-outlined">add</span>
        Create Task
      </button>

      {open && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={(e) => { if (e.target === overlayRef.current) setOpen(false); }}
        >
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <h2 className="text-headline-sm text-primary font-semibold">New Task</h2>
              <button
                className="p-1.5 text-secondary hover:bg-surface-container-low rounded-lg transition-all cursor-pointer"
                onClick={() => setOpen(false)}
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit(submit)} className="px-6 pb-6 pt-2">
              <div className="mb-4">
                <label htmlFor="task-title" className="block text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold mb-1.5">
                  Title *
                </label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="e.g. Prepare Q1 Invoice"
                  autoFocus
                  {...register('title')}
                  className="w-full px-3 py-2.5 border border-outline-variant rounded-lg text-body-md font-inherit bg-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                {errors.title && (
                  <p className="mt-1 text-label-sm text-error">{errors.title.message}</p>
                )}
              </div>
              <div className="mb-6">
                <label htmlFor="task-desc" className="block text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold mb-1.5">
                  Description
                </label>
                <textarea
                  id="task-desc"
                  placeholder="Optional description"
                  rows={3}
                  {...register('description')}
                  className="w-full px-3 py-2.5 border border-outline-variant rounded-lg text-body-md font-inherit bg-surface resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={submitting}
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
