# Audience Rule Builder

A full-stack application for creating complex audience segments using nested conditions and logical operators. Built with Angular 19+, Fastify, and NX monorepo.

## 🚀 Features

- **Visual Rule Builder**: Create complex audience rules with intuitive drag-and-drop UI
- **Nested Logic Groups**: Support for AND/OR operators with unlimited nesting depth
- **Live Preview**: Real-time preview of matching contacts as you build rules
- **Rule Management**: Save, load, and delete rule configurations
- **Rich Field Support**: Multiple field types with appropriate operators:
  - Email (contains, does not contain)
  - Country (is, is not)
  - Signup Date (before, after)
  - Purchase Count (equals, greater than, less than)
  - Plan (is, is not)
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **Type Safety**: Full TypeScript implementation across frontend and backend

## 📋 Table of Contents

- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Rule Data Model](#rule-data-model)
- [API Documentation](#api-documentation)
- [Development](#development)
- [Future Improvements](#future-improvements)

## 🏗 Architecture

```
┌─────────────────┐         HTTP API          ┌─────────────────┐
│   Angular 19    │ ◄────────────────────────► │    Fastify      │
│    Frontend     │    (JSON Rule Objects)     │     Backend     │
└─────────────────┘                            └─────────────────┘
        │                                              │
        │                                              │
        ▼                                              ▼
┌─────────────────┐                          ┌─────────────────┐
│  Shared Types   │ ◄────────────────────────► │  Data Models    │
│   Library       │      (TypeScript)          │    Library      │
└─────────────────┘                            └─────────────────┘
```

### Key Components

**Frontend (Angular 19)**
- `RuleBuilderComponent`: Main container orchestrating the entire UI
- `RuleGroupComponent`: Recursive component for AND/OR logic groups
- `RuleConditionComponent`: Single condition editor (field + operator + value)
- `LivePreviewComponent`: Real-time display of matching contacts
- `SavedRulesListComponent`: Manage saved rules

**Backend (Fastify)**
- `POST /api/evaluate`: Evaluate rules and return matching contacts
- `GET /api/rules`: List all saved rules
- `POST /api/rules`: Save a new rule
- `DELETE /api/rules/:id`: Delete a rule
- `GET /api/fields`: Get available fields and operators

**Shared Libraries**
- `@temp-nx/shared-types`: TypeScript interfaces shared between frontend and backend
- `@temp-nx/data-models`: Contact data and filtering engine

## 🛠 Tech Stack

### Frontend
- **Angular 19**: Latest Angular with standalone components
- **Tailwind CSS 4**: Utility-first CSS framework
- **RxJS**: Reactive programming with debounced updates
- **TypeScript**: Full type safety

### Backend
- **Fastify**: Fast and low-overhead web framework
- **TypeScript**: Type-safe API implementation
- **In-Memory Storage**: Simple data persistence (no database required)

### Monorepo
- **NX**: Powerful build system and monorepo tools
- **ESBuild**: Fast JavaScript bundler
- **TypeScript Path Mapping**: Shared library imports

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Chemist2U
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

### Running the Application

**Start both frontend and backend simultaneously:**
```bash
npm start
```

**Or start them separately:**

Backend (on port 3000):
```bash
npm run start:backend
```

Frontend (on port 4200):
```bash
npm run start:frontend
```

### Access the Application

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000/api

## 📁 Project Structure

```
Chemist2U/
├── apps/
│   ├── frontend/               # Angular application
│   │   └── src/
│   │       ├── app/
│   │       │   ├── components/ # UI components
│   │       │   ├── services/   # Angular services
│   │       │   └── app.ts      # Root component
│   │       └── styles.css      # Tailwind styles
│   │
│   └── backend/                # Fastify API server
│       └── src/
│           ├── app/
│           │   ├── routes/     # API route handlers
│           │   ├── storage.ts  # In-memory data storage
│           │   └── app.ts      # Fastify app setup
│           └── main.ts         # Server entry point
│
├── libs/
│   ├── shared-types/           # TypeScript interfaces
│   │   └── src/
│   │       └── lib/
│   │           └── shared-types.ts
│   │
│   └── data-models/            # Data and business logic
│       └── src/
│           └── lib/
│               ├── contacts.ts      # Sample contact data
│               └── filter-engine.ts # Rule evaluation logic
│
├── nx.json                     # NX configuration
├── package.json                # Dependencies and scripts
├── tailwind.config.js          # Tailwind configuration
└── README.md                   # This file
```

## 📊 Rule Data Model

Rules are represented as a tree structure with two types of nodes:

### Rule Structure

```typescript
interface Rule {
  id: string;
  name: string;
  condition: RuleCondition;
  createdAt?: string;
  updatedAt?: string;
}
```

### Condition Types

**Group (AND/OR logic):**
```typescript
{
  type: 'group',
  operator: 'AND' | 'OR',
  conditions: RuleCondition[]  // Nested conditions
}
```

**Single Condition:**
```typescript
{
  type: 'condition',
  field: string,      // e.g., 'email', 'country'
  comparison: string, // e.g., 'contains', 'is'
  value: any         // The value to compare against
}
```

### Example Rule

"Users where (country is Germany AND plan is premium) OR (signupDate before 2024-01-01 AND purchaseCount greater than 5)"

```json
{
  "id": "rule-123",
  "name": "Premium German Users or Early Adopters",
  "condition": {
    "type": "group",
    "operator": "OR",
    "conditions": [
      {
        "type": "group",
        "operator": "AND",
        "conditions": [
          {
            "type": "condition",
            "field": "country",
            "comparison": "is",
            "value": "Germany"
          },
          {
            "type": "condition",
            "field": "plan",
            "comparison": "is",
            "value": "premium"
          }
        ]
      },
      {
        "type": "group",
        "operator": "AND",
        "conditions": [
          {
            "type": "condition",
            "field": "signupDate",
            "comparison": "before",
            "value": "2024-01-01"
          },
          {
            "type": "condition",
            "field": "purchaseCount",
            "comparison": "greaterThan",
            "value": 5
          }
        ]
      }
    ]
  }
}
```

## 🔌 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### 1. Evaluate Rule
Evaluate a rule and get matching contacts.

**Request:**
```http
POST /api/evaluate
Content-Type: application/json

{
  "condition": {
    "type": "group",
    "operator": "AND",
    "conditions": [...]
  }
}
```

**Response:**
```json
{
  "matchCount": 15,
  "matches": [
    {
      "id": "1",
      "name": "Emma Schmidt",
      "email": "emma.schmidt@email.de",
      "country": "Germany",
      "signupDate": "2023-08-15",
      "purchaseCount": 5,
      "plan": "premium"
    }
  ],
  "totalContacts": 100
}
```

#### 2. List Rules
Get all saved rules.

**Request:**
```http
GET /api/rules
```

**Response:**
```json
{
  "rules": [
    {
      "id": "rule-123",
      "name": "Premium German Users",
      "condition": {...},
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### 3. Save Rule
Save a new rule.

**Request:**
```http
POST /api/rules
Content-Type: application/json

{
  "name": "Premium German Users",
  "condition": {
    "type": "group",
    "operator": "AND",
    "conditions": [...]
  }
}
```

**Response:**
```json
{
  "rule": {
    "id": "rule-123",
    "name": "Premium German Users",
    "condition": {...},
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### 4. Delete Rule
Delete a saved rule.

**Request:**
```http
DELETE /api/rules/:id
```

**Response:**
```json
{
  "success": true
}
```

#### 5. Get Fields
Get available fields and their operators.

**Request:**
```http
GET /api/fields
```

**Response:**
```json
{
  "fields": [
    {
      "field": "email",
      "label": "Email",
      "operators": [
        { "value": "contains", "label": "contains" },
        { "value": "doesNotContain", "label": "does not contain" }
      ],
      "valueType": "text"
    }
  ]
}
```

## 💻 Development

### Building for Production

Build both apps:
```bash
npm run build
```

Build individually:
```bash
npm run build:frontend
npm run build:backend
```

Output locations:
- Frontend: `dist/apps/frontend/`
- Backend: `dist/apps/backend/`

### Running Production Build

Backend:
```bash
node dist/apps/backend/main.js
```

Frontend (serve static files with your preferred web server)

### Code Quality

The project includes:
- ESLint for code linting
- Prettier for code formatting
- TypeScript strict mode
- Angular best practices

## 🎯 Future Improvements

### Short Term
- **Drag-and-drop reordering** of conditions within groups
- **More operators**: regex matching, range operators, isEmpty/isNotEmpty
- **Rule validation**: Detect incomplete or conflicting conditions
- **Export rules**: Generate SQL queries, MongoDB filters, or other formats
- **Keyboard shortcuts**: Power user navigation and editing

### Medium Term
- **Persistent database**: PostgreSQL or MongoDB for data storage
- **Bulk operations**: Import/export contacts in CSV/JSON
- **Rule templates**: Pre-built common audience segments
- **Performance optimization**: Handle 10K+ contacts efficiently
- **Advanced preview**: Pagination, sorting, filtering in preview
- **Rule comparison**: Visual diff between rule versions

### Long Term
- **User authentication**: Multi-user support with permissions
- **Rule sharing**: Collaborate on audience definitions
- **A/B testing integration**: Test rules before applying
- **Real-time collaboration**: Multiple users editing simultaneously
- **Audit logging**: Track who changed what and when
- **API rate limiting**: Production-ready security
- **Deployment automation**: CI/CD pipelines
- **Analytics dashboard**: Rule usage statistics and insights
- **Machine learning**: Suggest optimal rules based on data patterns
- **Multi-tenant support**: Isolated data per organization

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Built with ❤️ using NX, Angular 19, Fastify, and Tailwind CSS**
