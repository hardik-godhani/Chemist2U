import { describe, it, expect } from 'vitest';
import { evaluateCondition, filterContacts } from './filter-engine';
import { Contact, RuleCondition } from '@temp-nx/shared-types';

const sampleContacts: Contact[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    country: 'Germany',
    plan: 'premium',
    purchaseCount: 5,
    signupDate: '2024-01-15',
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@test.com',
    country: 'USA',
    plan: 'basic',
    purchaseCount: 2,
    signupDate: '2024-06-20',
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    country: 'Germany',
    plan: 'free',
    purchaseCount: 10,
    signupDate: '2023-12-01',
  },
];

describe('Filter Engine', () => {
  describe('evaluateCondition - Single Conditions', () => {
    it('should match country condition', () => {
      const condition: RuleCondition = {
        type: 'condition',
        field: 'country',
        comparison: 'is',
        value: 'Germany',
      };

      expect(evaluateCondition(sampleContacts[0], condition)).toBe(true);
      expect(evaluateCondition(sampleContacts[1], condition)).toBe(false);
    });

    it('should match email contains condition', () => {
      const condition: RuleCondition = {
        type: 'condition',
        field: 'email',
        comparison: 'contains',
        value: 'example',
      };

      expect(evaluateCondition(sampleContacts[0], condition)).toBe(true);
      expect(evaluateCondition(sampleContacts[1], condition)).toBe(false);
    });

    it('should match purchase count greater than', () => {
      const condition: RuleCondition = {
        type: 'condition',
        field: 'purchaseCount',
        comparison: 'greaterThan',
        value: 3,
      };

      expect(evaluateCondition(sampleContacts[0], condition)).toBe(true);
      expect(evaluateCondition(sampleContacts[1], condition)).toBe(false);
      expect(evaluateCondition(sampleContacts[2], condition)).toBe(true);
    });

    it('should match date after condition', () => {
      const condition: RuleCondition = {
        type: 'condition',
        field: 'signupDate',
        comparison: 'after',
        value: '2024-01-01',
      };

      expect(evaluateCondition(sampleContacts[0], condition)).toBe(true);
      expect(evaluateCondition(sampleContacts[2], condition)).toBe(false);
    });
  });

  describe('evaluateCondition - AND Groups', () => {
    it('should match all conditions in AND group', () => {
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
            field: 'purchaseCount',
            comparison: 'greaterThan',
            value: 3,
          },
        ],
      };

      expect(evaluateCondition(sampleContacts[0], condition)).toBe(true);
      expect(evaluateCondition(sampleContacts[2], condition)).toBe(true);
      expect(evaluateCondition(sampleContacts[1], condition)).toBe(false);
    });

    it('should fail if one condition fails in AND group', () => {
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
            value: 'enterprise',
          },
        ],
      };

      expect(evaluateCondition(sampleContacts[0], condition)).toBe(false);
      expect(evaluateCondition(sampleContacts[2], condition)).toBe(false);
    });

    it('should return true for empty AND group', () => {
      const condition: RuleCondition = {
        type: 'group',
        operator: 'AND',
        conditions: [],
      };

      expect(evaluateCondition(sampleContacts[0], condition)).toBe(true);
    });
  });

  describe('evaluateCondition - OR Groups', () => {
    it('should match if any condition matches in OR group', () => {
      const condition: RuleCondition = {
        type: 'group',
        operator: 'OR',
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

      expect(evaluateCondition(sampleContacts[0], condition)).toBe(true);
      expect(evaluateCondition(sampleContacts[1], condition)).toBe(false);
      expect(evaluateCondition(sampleContacts[2], condition)).toBe(true);
    });
  });

  describe('evaluateCondition - Nested Groups', () => {
    it('should handle nested AND/OR groups', () => {
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
            type: 'group',
            operator: 'OR',
            conditions: [
              {
                type: 'condition',
                field: 'plan',
                comparison: 'is',
                value: 'premium',
              },
              {
                type: 'condition',
                field: 'purchaseCount',
                comparison: 'greaterThan',
                value: 8,
              },
            ],
          },
        ],
      };

      expect(evaluateCondition(sampleContacts[0], condition)).toBe(true); // Germany + premium
      expect(evaluateCondition(sampleContacts[2], condition)).toBe(true); // Germany + 10 purchases
      expect(evaluateCondition(sampleContacts[1], condition)).toBe(false); // USA
    });
  });

  describe('filterContacts', () => {
    it('should filter contacts based on simple condition', () => {
      const condition: RuleCondition = {
        type: 'condition',
        field: 'country',
        comparison: 'is',
        value: 'Germany',
      };

      const result = filterContacts(sampleContacts, condition);
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('1');
      expect(result[1].id).toBe('3');
    });

    it('should filter contacts based on complex condition', () => {
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
            comparison: 'isNot',
            value: 'free',
          },
        ],
      };

      const result = filterContacts(sampleContacts, condition);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });

    it('should return all contacts for empty condition', () => {
      const condition: RuleCondition = {
        type: 'group',
        operator: 'AND',
        conditions: [],
      };

      const result = filterContacts(sampleContacts, condition);
      expect(result).toHaveLength(3);
    });

    it('should handle large datasets with chunking', () => {
      // Create large dataset
      const largeDataset: Contact[] = Array.from({ length: 2500 }, (_, i) => ({
        id: `${i}`,
        name: `Contact ${i}`,
        email: `contact${i}@example.com`,
        country: i % 2 === 0 ? 'Germany' : 'USA',
        plan: 'basic',
        purchaseCount: i,
        signupDate: '2024-01-01',
      }));

      const condition: RuleCondition = {
        type: 'condition',
        field: 'country',
        comparison: 'is',
        value: 'Germany',
      };

      const result = filterContacts(largeDataset, condition);
      expect(result).toHaveLength(1250);
    });
  });
});
