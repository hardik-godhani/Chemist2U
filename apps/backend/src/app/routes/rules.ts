import { FastifyInstance } from 'fastify';
import validator from 'validator';
import {
  Rule,
  SaveRuleRequest,
  SaveRuleResponse,
  ListRulesResponse,
  DeleteRuleResponse,
  validateRuleCondition,
} from '@temp-nx/shared-types';
import { ruleStorage } from '../storage';

/**
 * Recursively sanitize condition values to prevent XSS
 */
function sanitizeCondition(condition: any): any {
  if (condition.type === 'group') {
    return {
      ...condition,
      conditions: condition.conditions?.map((c: any) => sanitizeCondition(c)) || [],
    };
  } else if (condition.type === 'condition') {
    // Sanitize text values
    let sanitizedValue = condition.value;
    if (typeof sanitizedValue === 'string') {
      sanitizedValue = validator.escape(sanitizedValue.trim());
      // Limit string length
      if (sanitizedValue.length > 500) {
        sanitizedValue = sanitizedValue.substring(0, 500);
      }
    }
    
    return {
      ...condition,
      field: typeof condition.field === 'string' ? validator.escape(condition.field) : condition.field,
      comparison: typeof condition.comparison === 'string' ? validator.escape(condition.comparison) : condition.comparison,
      value: sanitizedValue,
    };
  }
  return condition;
}

export async function rulesRoutes(fastify: FastifyInstance) {
  // GET /api/rules - List all saved rules
  fastify.get('/rules', {
    config: {
      rateLimit: {
        max: Number(process.env.RATE_LIMIT_RULES_READ) || 60,
        timeWindow: '1 minute',
      },
    },
  }, async (request, reply) => {
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
      config: {
        rateLimit: {
          max: Number(process.env.RATE_LIMIT_RULES_WRITE) || 10,
          timeWindow: '1 minute',
        },
      },
      schema: {
        body: {
          type: 'object',
          required: ['name', 'condition'],
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 100 },
            condition: { type: 'object' },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        let { name, condition } = request.body;

        // Sanitize rule name to prevent XSS
        name = validator.escape(name.trim());
        
        // Validate name length after sanitization
        if (name.length === 0 || name.length > 100) {
          reply.status(400).send({
            error: 'Invalid input',
            message: 'Rule name must be between 1 and 100 characters',
          });
          return;
        }

        // Sanitize condition values recursively
        condition = sanitizeCondition(condition);

        // Validate condition structure
        const validation = validateRuleCondition(condition);
        if (!validation.valid) {
          reply.status(400).send({
            error: 'Invalid rule condition',
            message: validation.errors.join('; '),
          });
          return;
        }

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
    {
      config: {
        rateLimit: {
          max: Number(process.env.RATE_LIMIT_RULES_WRITE) || 10,
          timeWindow: '1 minute',
        },
      },
    },
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
