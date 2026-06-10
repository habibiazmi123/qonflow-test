import { z } from 'zod';
import { TaskStatus, PREDEFINED_ACTORS } from './types';

// ---------------------------------------------------------------------------
// Create task
// ---------------------------------------------------------------------------
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().optional().default(''),
});

// ---------------------------------------------------------------------------
// Update status
// ---------------------------------------------------------------------------
export const updateStatusSchema = z.object({
  status: z.enum([
    TaskStatus.TO_DO,
    TaskStatus.PENDING,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE,
  ] as const, {
    error: `Status must be one of: ${Object.values(TaskStatus).join(', ')}`,
  }),
  actor: z.enum(PREDEFINED_ACTORS as unknown as [string, ...string[]], {
    error: `Actor must be one of: ${PREDEFINED_ACTORS.join(', ')}`,
  }),
});
