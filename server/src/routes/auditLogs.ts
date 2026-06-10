import { Router, Request, Response } from 'express';
import { auditLogService } from '../services';

const router = Router();

/**
 * @openapi
 * /tasks/{taskId}/audit-logs:
 *   get:
 *     tags: [Audit Logs]
 *     summary: Get audit logs for a task
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Chronological list of audit log entries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AuditLogEntry'
 */
router.get('/:taskId/audit-logs', (req: Request, res: Response) => {
  const logs = auditLogService.getForTask(req.params.taskId);
  res.json({ data: logs });
});

export default router;
