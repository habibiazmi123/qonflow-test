import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Mini Task Manager API',
      version: '1.0.0',
      description: 'REST API for managing tasks with immutable audit logs.',
    },
    servers: [{ url: 'http://localhost:3001/api' }],
    components: {
      schemas: {
        Task: {
          type: 'object',
          required: ['id', 'title', 'description', 'status', 'createdAt', 'updatedAt'],
          properties: {
            id: { type: 'string', format: 'uuid', example: '733a3599-f0db-46a1-a425-2d6802eb1825' },
            title: { type: 'string', example: 'Prepare Invoice' },
            description: { type: 'string', example: 'Q1 invoice prep' },
            status: { type: 'string', enum: ['to_do', 'pending', 'in_progress', 'done'] },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        AuditLogEntry: {
          type: 'object',
          required: ['id', 'taskId', 'actor', 'fromStatus', 'toStatus', 'timestamp'],
          properties: {
            id: { type: 'string', format: 'uuid' },
            taskId: { type: 'string', format: 'uuid' },
            actor: { type: 'string', example: 'john.doe' },
            fromStatus: { type: 'string', enum: ['to_do', 'pending', 'in_progress', 'done'] },
            toStatus: { type: 'string', enum: ['to_do', 'pending', 'in_progress', 'done'] },
            timestamp: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
