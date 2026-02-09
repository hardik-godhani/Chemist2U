# Data Models Library

Contact data and filtering engine for the Audience Rule Builder.

## Usage

```typescript
import { sampleContacts, filterContacts, evaluateCondition } from '@temp-nx/data-models';
```

## Exports

- **sampleContacts**: 100 realistic sample contacts
- **filterContacts(contacts, condition)**: Filter contacts by rule
- **evaluateCondition(contact, condition)**: Evaluate single contact

## Sample Data

100 contacts with:
- Diverse international names
- Realistic email addresses
- 15 different countries
- 4 plan types (free, basic, premium, enterprise)
- Signup dates from 2020-2026
- Purchase counts 0-50

## Filtering Engine

Supports:
- Nested AND/OR groups
- All field types (email, country, date, number, select)
- All comparison operators
- Recursive evaluation
- Type-safe implementation
