import { describe, it, expect } from 'vitest';
import { validateRuleCondition, hasConditions } from './rule-validator';
import { RuleCondition } from './shared-types';

describe('Rule Validator', () => {
  describe('validateRuleCondition - Single Conditions', () => {
    it('should validate a valid condition', () => {
      const condition: RuleCondition = {
        type: 'condition',
        field: 'country',
        comparison: 'is',
        value: 'Germany',
      };

      const result = validateRuleCondition(condition);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when field is missing', () => {
      const condition: RuleCondition = {
        type: 'condition',
        field: '',
        comparison: 'is',
        value: 'Germany',
      };

      const result = validateRuleCondition(condition);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Field is required');
    });

    it('should fail when comparison is missing', () => {
      const condition: RuleCondition = {
        type: 'condition',
        field: 'country',
        comparison: '',
        value: 'Germany',
      };

      const result = validateRuleCondition(condition);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Operator is required');
    });

    it('should fail when value is missing', () => {
      const condition: RuleCondition = {
        type: 'condition',
        field: 'country',
        comparison: 'is',
        value: '',
      };

      const result = validateRuleCondition(condition);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Value is required');
    });

    it('should warn when purchase count is negative', () => {
      const condition: RuleCondition = {
        type: 'condition',
        field: 'purchaseCount',
        comparison: 'equals',
        value: -1,
      };

      const result = validateRuleCondition(condition);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Purchase count cannot be negative');
    });

    it('should warn when date is invalid', () => {
      const condition: RuleCondition = {
        type: 'condition',
        field: 'signupDate',
        comparison: 'after',
        value: 'invalid-date',
      };

      const result = validateRuleCondition(condition);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid date format');
    });
  });

  describe('validateRuleCondition - Groups', () => {
    it('should validate a valid AND group', () => {
      const condition: RuleCondition = {
        type: 'group',
        operator: 'AND',
        conditions: [
          {
            type: 'condition',
            field: 'country',
            comparison: 'is',
            value: 'Germany',
          },
          {
            type: 'condition',
            field: 'plan',
            comparison: 'is',
            value: 'premium',
          },
        ],
      };

      const result = validateRuleCondition(condition);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail when group has no conditions', () => {
      const condition: RuleCondition = {
        type: 'group',
        operator: 'AND',
        conditions: [],
      };

      const result = validateRuleCondition(condition);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Groups must contain at least one condition');
    });

    it('should warn about conflicting conditions in AND group', () => {
      const condition: RuleCondition = {
        type: 'group',
        operator: 'AND',
        conditions: [
          {
            type: 'condition',
            field: 'country',
            comparison: 'is',
            value: 'Germany',
          },
          {
            type: 'condition',
            field: 'country',
            comparison: 'is',
            value: 'USA',
          },
        ],
      };

      const result = validateRuleCondition(condition);
      expect(result.valid).toBe(true); // Valid structure
      expect(result.warnings).toContain(
        'Potential conflict: Field "country" has multiple different values in AND group. This may match no contacts.'
      );
    });

    it('should propagate errors from nested conditions', () => {
      const condition: RuleCondition = {
        type: 'group',
        operator: 'AND',
        conditions: [
          {
            type: 'condition',
            field: '',
            comparison: 'is',
            value: 'Germany',
          },
          {
            type: 'condition',
            field: 'plan',
            comparison: '',
            value: 'premium',
          },
        ],
      };

      const result = validateRuleCondition(condition);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Condition 1: Field is required');
      expect(result.errors).toContain('Condition 2: Operator is required');
    });
  });

  describe('hasConditions', () => {
    it('should return true for condition type', () => {
      const condition: RuleCondition = {
        type: 'condition',
        field: 'country',
        comparison: 'is',
        value: 'Germany',
      };

      expect(hasConditions(condition)).toBe(true);
    });

    it('should return true for group with conditions', () => {
      const condition: RuleCondition = {
        type: 'group',
        operator: 'AND',
        conditions: [
          {
            type: 'condition',
            field: 'country',
            comparison: 'is',
            value: 'Germany',
          },
        ],
      };

      expect(hasConditions(condition)).toBe(true);
    });

    it('should return false for empty group', () => {
      const condition: RuleCondition = {
        type: 'group',
        operator: 'AND',
        conditions: [],
      };

      expect(hasConditions(condition)).toBe(false);
    });
  });
});
