import { Router, Request, Response } from 'express';
import { taskService, ValidationError, NotFoundError } from '../services';
import { createTaskSchema, updateStatusSchema } from '../validation';

const router = Router();

/**
 * @openapi
 * /tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: List all tasks
 *     responses:
 *       200:
 *         description: Array of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 */
router.get('/', (_req: Request, res: Response) => {
  const tasks = taskService.list();
  res.json({ data: tasks });
});

/**
 * @openapi
 * /tasks/{id}:
 *   get:
 *     tags: [Tasks]
 *     summary: Get a task by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Task object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const task = taskService.getById(req.params.id);
    if (!task) {
      res.status(404).json({ error: { message: `Task ${req.params.id} not found`, code: 'NOT_FOUND' } });
      return;
    }
    res.json({ data: task });
  } catch {
    res.status(500).json({ error: { message: 'Internal server error', code: 'INTERNAL' } });
  }
});

/**
 * @openapi
 * /tasks:
 *   post:
 *     tags: [Tasks]
 *     summary: Create a new task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title:
 *                 type: string
 *                 description: Task title
 *               description:
 *                 type: string
 *                 description: Optional description
 *     responses:
 *       201:
 *         description: Created task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Validation error
 */
router.post('/', (req: Request, res: Response) => {
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: { message: parsed.error.issues[0]?.message ?? 'Validation failed', code: 'VALIDATION' },
    });
    return;
  }

  try {
    const task = taskService.create(parsed.data);
    res.status(201).json({ data: task });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: { message: err.message, code: 'VALIDATION' } });
      return;
    }
    res.status(500).json({ error: { message: 'Internal server error', code: 'INTERNAL' } });
  }
});

/**
 * @openapi
 * /tasks/{id}/status:
 *   put:
 *     tags: [Tasks]
 *     summary: Update task status
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status, actor]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [to_do, pending, in_progress, done]
 *               actor:
 *                 type: string
 *                 enum: [john.doe, jane.smith, bob.wilson]
 *     responses:
 *       200:
 *         description: Updated task
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Task'
 *       400:
 *         description: Invalid transition, status, or actor
 *       404:
 *         description: Task not found
 */
router.put('/:id/status', (req: Request, res: Response) => {
  const parsed = updateStatusSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: { message: parsed.error.issues[0]?.message ?? 'Validation failed', code: 'VALIDATION' },
    });
    return;
  }

  try {
    const task = taskService.updateStatus(req.params.id, parsed.data);
    res.json({ data: task });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: { message: err.message, code: 'VALIDATION' } });
      return;
    }
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: { message: err.message, code: 'NOT_FOUND' } });
      return;
    }
    res.status(500).json({ error: { message: 'Internal server error', code: 'INTERNAL' } });
  }
});

/**
 * @openapi
 * /tasks/{id}:
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete a task
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Deletion confirmed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *       404:
 *         description: Task not found
 */
router.delete('/:id', (req: Request, res: Response) => {
  try {
    taskService.remove(req.params.id);
    res.status(200).json({ data: { success: true } });
  } catch (err) {
    if (err instanceof NotFoundError) {
      res.status(404).json({ error: { message: err.message, code: 'NOT_FOUND' } });
      return;
    }
    res.status(500).json({ error: { message: 'Internal server error', code: 'INTERNAL' } });
  }
});

export default router;
