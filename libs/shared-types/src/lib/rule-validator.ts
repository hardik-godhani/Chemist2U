import { RuleCondition } from './shared-types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a rule condition recursively
 */
export function validateRuleCondition(condition: RuleCondition): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!condition) {
    errors.push('Condition is required');
    return { valid: false, errors, warnings };
  }

  if (condition.type === 'group') {
    // Validate group
    if (!condition.operator || (condition.operator !== 'AND' && condition.operator !== 'OR')) {
      errors.push('Group must have a valid operator (AND or OR)');
    }

    if (!condition.conditions || condition.conditions.length === 0) {
      errors.push('Groups must contain at least one condition');
    } else {
      // Recursively validate each condition in the group
      condition.conditions.forEach((c, index) => {
        const result = validateRuleCondition(c);
        result.errors.forEach(e => errors.push(`Condition ${index + 1}: ${e}`));
        result.warnings.forEach(w => warnings.push(w));
      });

      // Check for potentially conflicting conditions in AND groups
      if (condition.operator === 'AND') {
        const conflicts = detectConflicts(condition.conditions);
        conflicts.forEach(conflict => warnings.push(conflict));
      }
    }
  } else if (condition.type === 'condition') {
    // Validate single condition
    if (!condition.field || condition.field.trim() === '') {
      errors.push('Field is required');
    }

    if (!condition.comparison || condition.comparison.trim() === '') {
      errors.push('Operator is required');
    }

    if (condition.value === '' || condition.value === undefined || condition.value === null) {
      errors.push('Value is required');
    }

    // Validate specific field types
    if (condition.field && condition.comparison && condition.value !== undefined) {
      const fieldValidation = validateFieldValue(condition.field, condition.comparison, condition.value);
      errors.push(...fieldValidation.errors);
      warnings.push(...fieldValidation.warnings);
    }
  } else {
    errors.push('Invalid condition type');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate field-specific values
 */
function validateFieldValue(field: string, comparison: string, value: any): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  switch (field) {
    case 'purchaseCount':
      if (typeof value !== 'number' && isNaN(Number(value))) {
        errors.push('Purchase count must be a number');
      } else {
        const numValue = Number(value);
        if (numValue < 0) {
          errors.push('Purchase count cannot be negative');
        }
        if (numValue > 1000000) {
          warnings.push('Purchase count seems unusually high');
        }
      }
      break;

    case 'signupDate':
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        errors.push('Invalid date format');
      } else {
        const now = new Date();
        if (date > now) {
          warnings.push('Signup date is in the future');
        }
        const minDate = new Date('2000-01-01');
        if (date < minDate) {
          warnings.push('Signup date seems too old');
        }
      }
      break;

    case 'email':
      if (typeof value === 'string') {
        if (value.length === 0) {
          errors.push('Email value cannot be empty');
        }
        if (value.length > 500) {
          errors.push('Email value is too long');
        }
      }
      break;

    case 'country':
    case 'plan':
      if (typeof value === 'string') {
        if (value.length === 0) {
          errors.push(`${field} value cannot be empty`);
        }
        if (value.length > 100) {
          errors.push(`${field} value is too long`);
        }
      }
      break;
  }

  return { errors, warnings };
}

/**
 * Detect potentially conflicting conditions in AND groups
 */
function detectConflicts(conditions: RuleCondition[]): string[] {
  const warnings: string[] = [];
  const fieldValues: Record<string, Set<any>> = {};

  // Collect all field values
  conditions.forEach((condition) => {
    if (condition.type === 'condition' && condition.field && condition.comparison && condition.value) {
      // Only check for direct equality/inequality conflicts
      if (condition.comparison === 'is' || condition.comparison === 'equals') {
        if (!fieldValues[condition.field]) {
          fieldValues[condition.field] = new Set();
        }
        fieldValues[condition.field].add(JSON.stringify(condition.value));
      }
    }
  });

  // Check for conflicts (same field with multiple different values in AND group)
  Object.keys(fieldValues).forEach((field) => {
    if (fieldValues[field].size > 1) {
      warnings.push(
        `Potential conflict: Field "${field}" has multiple different values in AND group. This may match no contacts.`
      );
    }
  });

  return warnings;
}

/**
 * Check if a rule has any conditions (is not empty)
 */
export function hasConditions(condition: RuleCondition): boolean {
  if (condition.type === 'group') {
    return condition.conditions ? condition.conditions.length > 0 : false;
  }
  return condition.type === 'condition';
}
