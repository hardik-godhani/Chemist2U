import { describe, it, expect, beforeEach } from 'vitest';
import { RuleStorage } from './storage';
import { Rule } from '@temp-nx/shared-types';

describe('RuleStorage', () => {
  let storage: RuleStorage;

  beforeEach(() => {
    storage = new RuleStorage();
    // Clear all existing rules including sample data
    const allRules = storage.getAllRules();
    allRules.forEach(rule => storage.deleteRule(rule.id));
  });

  describe('saveRule', () => {
    it('should save a new rule', () => {
      const rule: Rule = {
        id: 'test-1',
        name: 'Test Rule',
        condition: {
          type: 'condition',
          field: 'country',
          comparison: 'is',
          value: 'Germany',
        },
      };

      const saved = storage.saveRule(rule);
      expect(saved.id).toBe(rule.id);
      expect(saved.name).toBe(rule.name);
      expect(saved.condition).toEqual(rule.condition);
      expect(saved.createdAt).toBeDefined();
      expect(saved.updatedAt).toBeDefined();
    });

    it('should update an existing rule', () => {
      const rule: Rule = {
        id: 'test-1',
        name: 'Test Rule',
        condition: {
          type: 'condition',
          field: 'country',
          comparison: 'is',
          value: 'Germany',
        },
      };

      storage.saveRule(rule);
      
      const updatedRule = {
        ...rule,
        name: 'Updated Rule',
      };

      const saved = storage.saveRule(updatedRule);
      expect(saved.name).toBe('Updated Rule');
      expect(saved.updatedAt).toBeDefined();
    });
  });

  describe('getAllRules', () => {
    it('should return empty array when no rules', () => {
      const rules = storage.getAllRules();
      expect(rules).toEqual([]);
    });

    it('should return all saved rules', () => {
      const rule1: Rule = {
        id: 'test-1',
        name: 'Rule 1',
        condition: { type: 'condition', field: 'country', comparison: 'is', value: 'Germany' },
      };

      const rule2: Rule = {
        id: 'test-2',
        name: 'Rule 2',
        condition: { type: 'condition', field: 'plan', comparison: 'is', value: 'premium' },
      };

      storage.saveRule(rule1);
      storage.saveRule(rule2);

      const rules = storage.getAllRules();
      expect(rules).toHaveLength(2);
      expect(rules[0].id).toBe('test-1');
      expect(rules[1].id).toBe('test-2');
    });
  });

  describe('deleteRule', () => {
    it('should delete an existing rule', () => {
      const rule: Rule = {
        id: 'test-1',
        name: 'Test Rule',
        condition: { type: 'condition', field: 'country', comparison: 'is', value: 'Germany' },
      };

      storage.saveRule(rule);
      expect(storage.getAllRules()).toHaveLength(1);

      const deleted = storage.deleteRule('test-1');
      expect(deleted).toBe(true);
      expect(storage.getAllRules()).toHaveLength(0);
    });

    it('should return false when deleting non-existent rule', () => {
      const deleted = storage.deleteRule('non-existent');
      expect(deleted).toBe(false);
    });
  });
});
