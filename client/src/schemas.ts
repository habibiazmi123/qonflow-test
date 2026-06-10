import { z } from 'zod';
import { PREDEFINED_ACTORS as actors } from './types';

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').trim(),
  description: z.string().optional().default(''),
});

export const updateStatusSchema = z.object({
  status: z.enum(['to_do', 'pending', 'in_progress', 'done'] as const),
  actor: z.enum(actors as unknown as [string, ...string[]]),
});

export type CreateTaskValues = z.infer<typeof createTaskSchema>;
