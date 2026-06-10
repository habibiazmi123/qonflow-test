import { Router, Request, Response } from 'express';
import { auditLogService } from '../services';

const router = Router();

// GET /api/tasks/:taskId/audit-logs
router.get('/:taskId/audit-logs', (req: Request, res: Response) => {
  const logs = auditLogService.getForTask(req.params.taskId);
  res.json({ data: logs });
});

export default router;
