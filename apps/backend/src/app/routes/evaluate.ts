import { FastifyInstance } from 'fastify';
import validator from 'validator';
import {
  EvaluateRuleRequest,
  EvaluateRuleResponse,
} from '@temp-nx/shared-types';
import { sampleContacts, filterContacts } from '@temp-nx/data-models';

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

export async function evaluateRoutes(fastify: FastifyInstance) {
  // POST /api/evaluate - Evaluate rule and return matching contacts
  fastify.post<{ Body: EvaluateRuleRequest }>(
    '/evaluate',
    {
      config: {
        rateLimit: {
          max: Number(process.env.RATE_LIMIT_EVALUATE) || 30,
          timeWindow: '1 minute',
        },
      },
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
        let { condition } = request.body;

        // Sanitize condition values
        condition = sanitizeCondition(condition);

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
