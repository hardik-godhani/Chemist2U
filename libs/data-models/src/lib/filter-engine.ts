import { Contact, RuleCondition } from '@temp-nx/shared-types';

/**
 * Evaluates a rule condition against a contact
 */
export function evaluateCondition(
  contact: Contact,
  condition: RuleCondition
): boolean {
  if (condition.type === 'group') {
    // Handle group with AND/OR logic
    if (!condition.conditions || condition.conditions.length === 0) {
      return true;
    }

    const results = condition.conditions.map((c) =>
      evaluateCondition(contact, c)
    );

    if (condition.operator === 'OR') {
      return results.some((r) => r);
    } else {
      // Default to AND
      return results.every((r) => r);
    }
  } else {
    // Handle single condition
    if (!condition.field || !condition.comparison) {
      return true;
    }

    return evaluateSingleCondition(
      contact,
      condition.field,
      condition.comparison,
      condition.value
    );
  }
}

/**
 * Evaluates a single field comparison
 */
function evaluateSingleCondition(
  contact: Contact,
  field: string,
  comparison: string,
  value: any
): boolean {
  const fieldValue = (contact as any)[field];

  switch (field) {
    case 'email':
      return evaluateEmailCondition(fieldValue, comparison, value);
    case 'country':
      return evaluateCountryCondition(fieldValue, comparison, value);
    case 'signupDate':
      return evaluateDateCondition(fieldValue, comparison, value);
    case 'purchaseCount':
      return evaluateNumberCondition(fieldValue, comparison, value);
    case 'plan':
      return evaluatePlanCondition(fieldValue, comparison, value);
    default:
      return false;
  }
}

function evaluateEmailCondition(
  email: string,
  comparison: string,
  value: string
): boolean {
  const emailLower = email.toLowerCase();
  const valueLower = (value || '').toLowerCase();

  switch (comparison) {
    case 'contains':
      return emailLower.includes(valueLower);
    case 'doesNotContain':
      return !emailLower.includes(valueLower);
    default:
      return false;
  }
}

function evaluateCountryCondition(
  country: string,
  comparison: string,
  value: string
): boolean {
  switch (comparison) {
    case 'is':
      return country === value;
    case 'isNot':
      return country !== value;
    default:
      return false;
  }
}

function evaluateDateCondition(
  signupDate: string,
  comparison: string,
  value: string
): boolean {
  const date = new Date(signupDate);
  const compareDate = new Date(value);

  switch (comparison) {
    case 'before':
      return date < compareDate;
    case 'after':
      return date > compareDate;
    default:
      return false;
  }
}

function evaluateNumberCondition(
  purchaseCount: number,
  comparison: string,
  value: number
): boolean {
  const numValue = Number(value);

  switch (comparison) {
    case 'equals':
      return purchaseCount === numValue;
    case 'greaterThan':
      return purchaseCount > numValue;
    case 'lessThan':
      return purchaseCount < numValue;
    default:
      return false;
  }
}

function evaluatePlanCondition(
  plan: string,
  comparison: string,
  value: string
): boolean {
  switch (comparison) {
    case 'is':
      return plan === value;
    case 'isNot':
      return plan !== value;
    default:
      return false;
  }
}

/**
 * Filters an array of contacts based on a rule condition
 */
export function filterContacts(
  contacts: Contact[],
  condition: RuleCondition
): Contact[] {
  return contacts.filter((contact) => evaluateCondition(contact, condition));
}
