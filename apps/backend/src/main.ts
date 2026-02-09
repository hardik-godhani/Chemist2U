import Fastify from 'fastify';
import cors from '@fastify/cors';
import { app } from './app/app';

const host = process.env.HOST ?? '0.0.0.0';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// Instantiate Fastify
const server = Fastify({
  logger: true,
});

// Register plugins
server.register(cors, {
  origin: true, // Allow all origins in development
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
