import { FastifyInstance } from 'fastify';
import {
  EvaluateRuleRequest,
  EvaluateRuleResponse,
} from '@temp-nx/shared-types';
import { sampleContacts, filterContacts } from '@temp-nx/data-models';

export async function evaluateRoutes(fastify: FastifyInstance) {
  // POST /api/evaluate - Evaluate rule and return matching contacts
  fastify.post<{ Body: EvaluateRuleRequest }>(
    '/evaluate',
    {
      schema: {
        body: {
          type: 'object',
          required: ['condition'],
          properties: {
            condition: { type: 'object' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { condition } = request.body;

        // Filter contacts based on the rule
        const matches = filterContacts(sampleContacts, condition);

        const response: EvaluateRuleResponse = {
          matchCount: matches.length,
          matches: matches, // Return all matches
          totalContacts: sampleContacts.length,
        };

        return response;
      } catch (error) {
        fastify.log.error(error);
        reply.status(400).send({
          error: 'Failed to evaluate rule',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );
}
