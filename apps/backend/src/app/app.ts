import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { rulesRoutes } from './routes/rules';
import { evaluateRoutes } from './routes/evaluate';
import { fieldsRoutes } from './routes/fields';

export async function app(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions
) {
  // Health check
  fastify.get('/api', async () => {
    return { message: 'Audience Rule Builder API' };
  });

  // Health check endpoint for monitoring and deployment verification
  fastify.get('/api/health', async () => {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();
    
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: {
        seconds: Math.floor(uptime),
        formatted: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`
      },
      memory: {
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`
      },
      environment: process.env.NODE_ENV || 'development'
    };
  });

  // Register routes
  fastify.register(rulesRoutes, { prefix: '/api' });
  fastify.register(evaluateRoutes, { prefix: '/api' });
  fastify.register(fieldsRoutes, { prefix: '/api' });
}
