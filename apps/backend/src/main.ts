import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { app } from './app/app';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:4200';

// Instantiate Fastify
const server = Fastify({
  logger: true,
});

// Register plugins
server.register(cors, {
  origin: process.env.NODE_ENV === 'production' ? corsOrigin : true,
});

// Register rate limiting
server.register(rateLimit, {
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  timeWindow: Number(process.env.RATE_LIMIT_WINDOW) || 60000, // 1 minute
  allowList: process.env.NODE_ENV === 'development' ? ['127.0.0.1', '::1'] : undefined,
  errorResponseBuilder: (request, context) => {
    return {
      statusCode: 429,
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Retry after ${Math.ceil(context.ttl / 1000)} seconds.`,
      retryAfter: Math.ceil(context.ttl / 1000),
    };
  },
});

server.register(app);

// Run the server
const start = async () => {
  try {
    await server.listen({ port, host });
    console.log(`[ ready ] http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
