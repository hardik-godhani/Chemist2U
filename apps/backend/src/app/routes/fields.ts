import { FastifyInstance } from 'fastify';
import { FIELD_OPERATORS, GetFieldsResponse } from '@temp-nx/shared-types';

export async function fieldsRoutes(fastify: FastifyInstance) {
  // GET /api/fields - Get available fields and their operators
  fastify.get('/fields', async (request, reply) => {
    try {
      const response: GetFieldsResponse = {
        fields: FIELD_OPERATORS,
      };
      return response;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({
        error: 'Failed to retrieve fields',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });
}
