import { Rule } from '@temp-nx/shared-types';

// In-memory storage for rules
export class RuleStorage {
  private rules: Map<string, Rule> = new Map();

  constructor() {
    // Initialize with some example rules for demo
    this.initializeSampleRules();
  }

  private initializeSampleRules() {
    const sampleRule: Rule = {
      id: 'sample-1',
      name: 'Premium German Users',
      condition: {
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
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.rules.set(sampleRule.id, sampleRule);
  }

  getAllRules(): Rule[] {
    return Array.from(this.rules.values());
  }

  getRule(id: string): Rule | undefined {
    return this.rules.get(id);
  }

  saveRule(rule: Rule): Rule {
    const now = new Date().toISOString();
    const existingRule = this.rules.get(rule.id);

    const updatedRule: Rule = {
      ...rule,
      createdAt: existingRule?.createdAt || now,
      updatedAt: now,
    };

    this.rules.set(rule.id, updatedRule);
    return updatedRule;
  }

  deleteRule(id: string): boolean {
    return this.rules.delete(id);
  }
}

// Singleton instance
export const ruleStorage = new RuleStorage();
