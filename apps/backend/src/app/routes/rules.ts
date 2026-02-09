import { FastifyInstance } from 'fastify';
import {
  Rule,
  SaveRuleRequest,
  SaveRuleResponse,
  ListRulesResponse,
  DeleteRuleResponse,
} from '@temp-nx/shared-types';
import { ruleStorage } from '../storage';

export async function rulesRoutes(fastify: FastifyInstance) {
  // GET /api/rules - List all saved rules
  fastify.get('/rules', async (request, reply) => {
    try {
      const rules = ruleStorage.getAllRules();
      const response: ListRulesResponse = { rules };
      return response;
    } catch (error) {
      fastify.log.error(error);
      reply.status(500).send({
        error: 'Failed to retrieve rules',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  });

  // POST /api/rules - Save a new rule
  fastify.post<{ Body: SaveRuleRequest }>(
    '/rules',
    {
      schema: {
        body: {
          type: 'object',
          required: ['name', 'condition'],
          properties: {
            name: { type: 'string' },
            condition: { type: 'object' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { name, condition } = request.body;

        // Generate a unique ID
        const id = `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const rule: Rule = {
          id,
          name,
          condition,
        };

        const savedRule = ruleStorage.saveRule(rule);
        const response: SaveRuleResponse = { rule: savedRule };

        reply.status(201).send(response);
      } catch (error) {
        fastify.log.error(error);
        reply.status(400).send({
          error: 'Failed to save rule',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );

  // DELETE /api/rules/:id - Delete a rule
  fastify.delete<{ Params: { id: string } }>(
    '/rules/:id',
    async (request, reply) => {
      try {
        const { id } = request.params;
        const deleted = ruleStorage.deleteRule(id);

        if (!deleted) {
          reply.status(404).send({
            error: 'Rule not found',
            message: `No rule found with id: ${id}`,
          });
          return;
        }

        const response: DeleteRuleResponse = { success: true };
        return response;
      } catch (error) {
        fastify.log.error(error);
        reply.status(500).send({
          error: 'Failed to delete rule',
          message: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }
  );
}
