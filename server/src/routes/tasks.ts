import { Router, Request, Response } from 'express';
import { taskService, ValidationError, NotFoundError } from '../services';
import { TaskStatus, PREDEFINED_ACTORS } from '../types';

const router = Router();

// GET /api/tasks
router.get('/', (_req: Request, res: Response) => {
  const tasks = taskService.list();
  res.json({ data: tasks });
});

// GET /api/tasks/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const task = taskService.getById(req.params.id);
    if (!task) {
      res.status(404).json({ error: { message: `Task ${req.params.id} not found`, code: 'NOT_FOUND' } });
      return;
    }
    res.json({ data: task });
  } catch (err) {
    res.status(500).json({ error: { message: 'Internal server error', code: 'INTERNAL' } });
  }
});

// POST /api/tasks
router.post('/', (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const task = taskService.create({ title, description });
    res.status(201).json({ data: task });
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: { message: err.message, code: 'VALIDATION' } });
      return;
    }
    res.status(500).json({ error: { message: 'Internal server error', code: 'INTERNAL' } });
  }
});

// PUT /api/tasks/:id/status
router.put('/:id/status', (req: Request, res: Response) => {
  try {
    const { status, actor } = req.body;

    // Validate status is a known value
    if (!status || !Object.values(TaskStatus).includes(status)) {
      res.status(400).json({
        error: {
          message: `Invalid status "${status}". Must be one of: ${Object.values(TaskStatus).join(', ')}`,
          code: 'VALIDATION',
        },
      });
      return;
    }

    // Validate actor is in predefined list
    if (!actor || !PREDEFINED_ACTORS.includes(actor)) {
      res.status(400).json({
        error: {
          message: `Invalid actor "${actor}". Must be one of: ${PREDEFINED_ACTORS.join(', ')}`,
          code: 'VALIDATION',
        },
      });
      return;
    }

    const task = taskService.updateStatus(req.params.id, { status, actor });
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

// DELETE /api/tasks/:id
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
