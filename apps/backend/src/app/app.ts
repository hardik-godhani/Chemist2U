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

  // Register routes
  fastify.register(rulesRoutes, { prefix: '/api' });
  fastify.register(evaluateRoutes, { prefix: '/api' });
  fastify.register(fieldsRoutes, { prefix: '/api' });
}
