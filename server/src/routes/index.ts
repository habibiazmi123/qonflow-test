import { Router } from 'express';
import taskRoutes from './tasks';
import auditLogRoutes from './auditLogs';

const router = Router();

router.use('/tasks', taskRoutes);
router.use('/tasks', auditLogRoutes);

export default router;
