// Contact interface
export interface Contact {
  id: string;
  name: string;
  email: string;
  country: string;
  signupDate: string; // ISO 8601 date string
  purchaseCount: number;
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
}

// Field operators mapping
export interface FieldOperator {
  field: string;
  label: string;
  operators: Operator[];
  valueType: 'text' | 'select' | 'date' | 'number';
  selectOptions?: string[];
}

export interface Operator {
  value: string;
  label: string;
}

// Rule condition types
export type RuleConditionType = 'group' | 'condition';
export type LogicalOperator = 'AND' | 'OR';

// Rule condition - can be either a group or a single condition
export interface RuleCondition {
  type: RuleConditionType;
  // For groups
  operator?: LogicalOperator;
  conditions?: RuleCondition[];
  // For conditions
  field?: string;
  comparison?: string;
  value?: any;
}

// Complete rule with metadata
export interface Rule {
  id: string;
  name: string;
  condition: RuleCondition;
  createdAt?: string;
  updatedAt?: string;
}

// API request/response types
export interface EvaluateRuleRequest {
  condition: RuleCondition;
}

export interface EvaluateRuleResponse {
  matchCount: number;
  matches: Contact[];
  totalContacts: number;
}

export interface SaveRuleRequest {
  name: string;
  condition: RuleCondition;
}

export interface SaveRuleResponse {
  rule: Rule;
}

export interface ListRulesResponse {
  rules: Rule[];
}

export interface DeleteRuleResponse {
  success: boolean;
}

export interface GetFieldsResponse {
  fields: FieldOperator[];
}

// Available field operators
export const FIELD_OPERATORS: FieldOperator[] = [
  {
    field: 'email',
    label: 'Email',
    operators: [
      { value: 'contains', label: 'contains' },
      { value: 'doesNotContain', label: 'does not contain' }
    ],
    valueType: 'text'
  },
  {
    field: 'country',
    label: 'Country',
    operators: [
      { value: 'is', label: 'is' },
      { value: 'isNot', label: 'is not' }
    ],
    valueType: 'select',
    selectOptions: [
      'United States',
      'United Kingdom',
      'Germany',
      'France',
      'Spain',
      'Italy',
      'Canada',
      'Australia',
      'Japan',
      'India',
      'Brazil',
      'Mexico',
      'Netherlands',
      'Sweden',
      'Norway'
    ]
  },
  {
    field: 'signupDate',
    label: 'Signup Date',
    operators: [
      { value: 'before', label: 'before' },
      { value: 'after', label: 'after' }
    ],
    valueType: 'date'
  },
  {
    field: 'purchaseCount',
    label: 'Purchase Count',
    operators: [
      { value: 'equals', label: 'equals' },
      { value: 'greaterThan', label: 'greater than' },
      { value: 'lessThan', label: 'less than' }
    ],
    valueType: 'number'
  },
  {
    field: 'plan',
    label: 'Plan',
    operators: [
      { value: 'is', label: 'is' },
      { value: 'isNot', label: 'is not' }
    ],
    valueType: 'select',
    selectOptions: ['free', 'basic', 'premium', 'enterprise']
  }
];
