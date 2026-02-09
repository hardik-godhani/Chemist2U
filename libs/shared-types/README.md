# Shared Types Library

TypeScript interfaces and types shared between frontend and backend.

## Usage

```typescript
import { Rule, RuleCondition, Contact, FieldOperator } from '@temp-nx/shared-types';
```

## Exports

- **Contact**: User/contact data structure
- **Rule**: Complete rule with metadata
- **RuleCondition**: Rule condition (group or single condition)
- **FieldOperator**: Field definition with operators
- **API Request/Response types**: All API endpoint types
- **FIELD_OPERATORS**: Available fields and their operators

## Benefits

- Single source of truth for types
- Compile-time type checking across apps
- Prevents API contract mismatches
- Better IDE autocomplete
