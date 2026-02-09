# 🎯 Audience Rule Builder - Full Stack Application

> A powerful full-stack application for creating complex audience segments using nested conditions and logical operators. Built with Angular 19+, Fastify, and NX monorepo.

**Status**: ✅ Production Ready  
**Version**: 1.0.0  
**License**: MIT

---

## 📑 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Available Fields & Operators](#available-fields--operators)
- [API Documentation](#api-documentation)
- [Data Model](#data-model)
- [Components Guide](#components-guide)
- [Services Guide](#services-guide)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [FAQ](#faq)

---

## 🎯 Overview

The **Audience Rule Builder** is a sophisticated tool that allows users to create complex audience segments using an intuitive visual interface. It combines the power of nested logical operators (AND/OR) with multiple field types to enable precise audience targeting.

### Key Use Cases
- **Audience Segmentation**: Define target audiences based on multiple criteria
- **Rule-based Filtering**: Create complex filters with unlimited nesting depth
- **Real-time Preview**: See matching contacts instantly as you build rules
- **Rule Management**: Save, organize, and reuse rule configurations

---

## 🚀 Features

### Core Features
- ✨ **Visual Rule Builder**: Intuitive interface for building complex rules
- 🎯 **Nested Logic Groups**: Support for AND/OR operators with unlimited nesting depth
- 👁️ **Live Preview**: Real-time preview of matching contacts as you build rules
- 💾 **Rule Management**: Save, load, edit, and delete rule configurations
- 🔐 **Input Validation**: Comprehensive validation with helpful error messages
- ⚠️ **Warning System**: Intelligent warnings for potentially conflicting rules
- 📱 **Responsive Design**: Works seamlessly on desktop and tablet devices

### Field Support
The application supports multiple field types with appropriate operators:

| Field | Type | Operators | Examples |
|-------|------|-----------|----------|
| **Email** | Text | contains, does not contain | Contains "gmail.com" |
| **Country** | Select | is, is not | is United States |
| **Signup Date** | Date | before, after | after 2024-01-01 |
| **Purchase Count** | Number | equals, greater than, less than | greater than 5 |
| **Plan** | Select | is, is not | is premium |

### Advanced Features
- 🔒 **Security**: Input sanitization and rate limiting
- 📊 **Performance**: Optimized filtering with early exit strategy
- 🧪 **Testing**: Comprehensive unit tests for core logic
- 📝 **Type Safety**: Full TypeScript implementation
- 🔄 **State Management**: RxJS-based state management with debounced updates
- 🌐 **CORS Enabled**: Ready for production deployment
- 📈 **Health Monitoring**: Built-in health check endpoint

---

## 🏗️ Architecture

### System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                         │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Angular 19 Frontend                       │  │
│  │                                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌────────────┐  │  │
│  │  │  Rule Page   │  │  Rule Builder│  │  Navbar    │  │  │
│  │  │  Components  │  │  Components  │  │            │  │  │
│  │  └──────────────┘  └──────────────┘  └────────────┘  │  │
│  │                                                        │  │
│  │  ┌──────────────────────────────────────────────────┐ │  │
│  │  │          Services (HTTP, State Management)       │ │  │
│  │  │  - RuleService (API communication)              │ │  │
│  │  │  - RuleStateService (State management)          │ │  │
│  │  └──────────────────────────────────────────────────┘ │  │
│  └────────────────────────────────────────────────────────┘  │
│                           ▼ HTTP                              │
└──────────────────────────────────────────────────────────────┘
                             │
                (JSON API - RESTful)
                             │
┌──────────────────────────────────────────────────────────────┐
│                  SERVER (Node.js)                            │
│                                                               │
│  ┌────────────────────────────────────────────────────────┐  │
│  │              Fastify Backend                           │  │
│  │                                                        │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐  │  │
│  │  │ Route:      │  │ Route:      │  │ Route:       │  │  │
│  │  │ /evaluate   │  │ /rules      │  │ /fields      │  │  │
│  │  └─────────────┘  └─────────────┘  └──────────────┘  │  │
│  │                                                        │  │
│  │  ┌────────────────────────────────────────────────────┤  │
│  │  │              Core Services                         │  │
│  │  │  - Rule Validator (validateRuleCondition)         │  │
│  │  │  - Filter Engine (evaluateCondition)              │  │
│  │  │  - Storage (In-Memory)                            │  │
│  │  └────────────────────────────────────────────────────┤  │
│  │                                                        │  │
│  │  ┌────────────────────────────────────────────────────┤  │
│  │  │              Data Layer                            │  │  
│  │  │  - Sample Contacts (100 contacts)                 │  │  
│  │  └────────────────────────────────────────────────────┤  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
                             ▼
                    Shared Libraries
                             │
        ┌────────────────────┴────────────────────┐
        │                                         │
   ┌────────────────────┐         ┌──────────────────────┐
   │ Shared Types       │         │ Data Models          │
   │ - Interfaces       │         │ - Contact data       │
   │ - Type definitions │         │ - Filter engine      │
   │ - Validation       │         │ - Filtering logic    │
   └────────────────────┘         └──────────────────────┘
```

### Data Flow

1. **User builds a rule** in the UI
2. **Frontend** sends rule condition to backend API
3. **Backend** validates and sanitizes the rule
4. **Filter Engine** evaluates the rule against sample contacts
5. **Results** returned to frontend for live preview
6. **User saves rule** to in-memory storage
7. **Saved rules** can be loaded, edited, or deleted

---

## 🛠️ Tech Stack

### Frontend Stack
- **Angular 19**: Latest Angular framework with standalone components
  - Reactive form handling
  - Material UI components
  - RxJS for reactive programming
- **Tailwind CSS 4**: Utility-first CSS framework
- **TypeScript 5+**: Static typing with strict mode
- **Material Design**: Professional UI components
- **DOMPurify**: HTML sanitization for security
- **Lodash-ES**: Utility functions

### Backend Stack
- **Fastify**: Ultra-fast web framework for Node.js
  - CORS support
  - Rate limiting
  - Request validation
  - Excellent performance
- **TypeScript 5+**: Type-safe backend code
- **Validator.js**: Input validation and sanitization
- **Node.js 18+**: Runtime environment

### Development & Build Tools
- **NX 22+**: Powerful monorepo management
  - Dependency graph
  - Affected builds
  - Code generation
- **Vitest**: Modern unit testing framework
- **ESBuild**: Lightning-fast bundler
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting

### Infrastructure
- **Docker**: Containerization (via nginx.conf)
- **Nginx**: Reverse proxy and static file serving
- **PM2**: Process manager for production (ecosystem.config.js)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher
- **Git**: For cloning the repository

### 5-Minute Setup

```bash
# 1. Clone the repository
git clone <repository-url>
cd Chemist2U

# 2. Install dependencies
npm install

# 3. Start both frontend and backend
npm start

# Frontend: http://localhost:4200
# Backend: http://localhost:3000
```

The application will be available at `http://localhost:4200` in your browser.

---

## 📦 Installation

### Detailed Setup Instructions

```bash
# Clone the repository
git clone https://github.com/your-org/Chemist2U.git
cd Chemist2U

# Install all dependencies
npm install

# Verify installation
npm run build

# Run tests to ensure everything works
npm test
```

### Install Specific Services Only

```bash
# Start frontend only
npm run start:frontend

# Start backend only
npm run start:backend
```

---

## 📂 Project Structure

```
Chemist2U/
├── apps/                          # Main applications
│   ├── backend/                   # Fastify API server
│   │   ├── src/
│   │   │   ├── main.ts           # Server entry point
│   │   │   └── app/
│   │   │       ├── app.ts        # Main app plugin
│   │   │       ├── storage.ts    # In-memory storage
│   │   │       └── routes/
│   │   │           ├── evaluate.ts  # POST /api/evaluate
│   │   │           ├── rules.ts     # CRUD /api/rules
│   │   │           └── fields.ts    # GET /api/fields
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── README.md
│   │
│   └── frontend/                  # Angular application
│       ├── src/
│       │   ├── main.ts           # Angular bootstrap
│       │   ├── index.html        # HTML entry point
│       │   ├── styles.scss       # Global styles
│       │   └── app/
│       │       ├── app.ts        # Root component
│       │       ├── app.routes.ts # Route definitions
│       │       ├── app.config.ts # Angular config
│       │       │
│       │       ├── components/
│       │       │   ├── navbar/           # Top navigation
│       │       │   ├── rule-group/       # Recursive group container
│       │       │   └── rule-condition/   # Single condition editor
│       │       │
│       │       ├── pages/
│       │       │   ├── rules-page/       # Main rules builder page
│       │       │   └── contacts-page/    # Contacts list page
│       │       │
│       │       └── services/
│       │           ├── rule.service.ts        # HTTP API calls
│       │           └── rule-state.service.ts # State management
│       │
│       ├── package.json
│       ├── tsconfig.json
│       └── README.md
│
├── libs/                          # Shared libraries
│   ├── shared-types/             # TypeScript interfaces
│   │   ├── src/lib/
│   │   │   ├── shared-types.ts   # Core interfaces
│   │   │   └── rule-validator.ts # Validation logic
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── data-models/              # Data layer
│       ├── src/lib/
│       │   ├── contacts.ts       # Sample contact data
│       │   └── filter-engine.ts  # Filtering logic
│       ├── package.json
│       └── tsconfig.json
│
├── Configuration Files
│   ├── nx.json                   # NX configuration
│   ├── tsconfig.base.json        # Base TypeScript config
│   ├── package.json              # Root dependencies
│   ├── tailwind.config.js        # Tailwind CSS config
│   ├── postcss.config.js         # PostCSS config
│   ├── vitest.config.ts          # Test runner config
│   ├── eslint.config.mjs         # ESLint configuration
│   └── ecosystem.config.js       # PM2 configuration
│
├── Deployment Files
│   ├── nginx.conf                # Nginx configuration
│   ├── deploy.sh                 # Deployment script
│   ├── server-setup.sh           # Server setup script
│   ├── logrotate-chemist2u.conf  # Log rotation
│   └── QUICKSTART.md             # Quick deployment guide
│
└── Documentation
    ├── README.md                 # Main documentation
    └── QUICKSTART.md             # Quick start guide
```

---

## 🎯 Available Fields & Operators

### Field Configuration Reference

The application comes pre-configured with the following fields and operators:

#### 1. **Email Field**
- **Type**: Text input
- **Operators**: 
  - `contains` - Email address contains text
  - `doesNotContain` - Email address does not contain text
- **Example**: Email contains "@gmail.com"

#### 2. **Country Field**
- **Type**: Select dropdown
- **Operators**:
  - `is` - Country equals exact value
  - `isNot` - Country does not equal value
- **Available Options**: 
  - United States, United Kingdom, Germany, France, Spain, Italy
  - Canada, Australia, Japan, India, Brazil, Mexico
  - Netherlands, Sweden, Norway
- **Example**: Country is Germany

#### 3. **Signup Date Field**
- **Type**: Date picker
- **Operators**:
  - `before` - Signup date is before specified date
  - `after` - Signup date is after specified date
- **Format**: ISO 8601 (YYYY-MM-DD)
- **Example**: Signup Date after 2024-01-01

#### 4. **Purchase Count Field**
- **Type**: Number input
- **Operators**:
  - `equals` - Purchase count equals exact value
  - `greaterThan` - Purchase count is greater than value
  - `lessThan` - Purchase count is less than value
- **Example**: Purchase Count greater than 5

#### 5. **Plan Field**
- **Type**: Select dropdown
- **Operators**:
  - `is` - Plan equals exact value
  - `isNot` - Plan does not equal value
- **Available Options**: free, basic, premium, enterprise
- **Example**: Plan is premium

---

## 🔌 API Documentation

### Base URL
- **Development**: `http://localhost:3000`
- **Production**: Configure via environment variables

### Endpoints

#### 1. Health Check
```
GET /api/health
```

**Description**: Check server health and uptime

**Response** (200 OK):
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": {
    "seconds": 3600,
    "formatted": "1h 0m 0s"
  },
  "memory": {
    "rss": "64MB",
    "heapUsed": "48MB",
    "heapTotal": "128MB"
  },
  "environment": "development"
}
```

#### 2. Evaluate Rule
```
POST /api/evaluate
```

**Description**: Evaluate a rule against sample contacts and return matches

**Request Body**:
```json
{
  "condition": {
    "type": "group",
    "operator": "AND",
    "conditions": [
      {
        "type": "condition",
        "field": "country",
        "comparison": "is",
        "value": "United States"
      },
      {
        "type": "condition",
        "field": "plan",
        "comparison": "is",
        "value": "premium"
      }
    ]
  }
}
```

**Response** (200 OK):
```json
{
  "matchCount": 15,
  "matches": [
    {
      "id": "1",
      "name": "John Smith",
      "email": "john.smith@email.com",
      "country": "United States",
      "signupDate": "2022-03-20",
      "purchaseCount": 12,
      "plan": "premium"
    }
  ],
  "totalContacts": 100
}
```

#### 3. Get Available Fields
```
GET /api/fields
```

**Description**: Get list of available fields and their operators

**Response** (200 OK):
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

#### 4. List Saved Rules
```
GET /api/rules
```

**Description**: Get all saved rules

**Response** (200 OK):
```json
{
  "rules": [
    {
      "id": "rule-1705328400000-abc123",
      "name": "Premium US Users",
      "condition": {
        "type": "group",
        "operator": "AND",
        "conditions": []
      }
    }
  ]
}
```

#### 5. Save Rule
```
POST /api/rules
```

**Description**: Create and save a new rule

**Request Body**:
```json
{
  "name": "Premium US Users",
  "condition": {
    "type": "group",
    "operator": "AND",
    "conditions": []
  }
}
```

**Response** (201 Created):
```json
{
  "rule": {
    "id": "rule-1705328400000-abc123",
    "name": "Premium US Users",
    "condition": {}
  }
}
```

#### 6. Delete Rule
```
DELETE /api/rules/:id
```

**Description**: Delete a saved rule by ID

**Response** (200 OK):
```json
{
  "success": true
}
```

### Rate Limiting

The API includes rate limiting to prevent abuse:

| Endpoint | Limit | Window |
|----------|-------|--------|
| `/evaluate` | 30 requests | 1 minute |
| `/rules` (GET) | 60 requests | 1 minute |
| `/rules` (POST/DELETE) | 10 requests | 1 minute |
| `/fields` | 60 requests | 1 minute |

---

## 📊 Data Model

### Contact Interface

```typescript
interface Contact {
  id: string;              // Unique identifier
  name: string;            // User's full name
  email: string;           // Email address
  country: string;         // Country of residence
  signupDate: string;      // ISO 8601 date string (YYYY-MM-DD)
  purchaseCount: number;   // Total purchases made
  plan: 'free' | 'basic' | 'premium' | 'enterprise';
}
```

### Rule Condition Structure

```typescript
interface RuleCondition {
  type: 'group' | 'condition';
  
  // For groups
  operator?: 'AND' | 'OR';
  conditions?: RuleCondition[];
  
  // For single conditions
  field?: string;           // e.g., 'email', 'country'
  comparison?: string;      // e.g., 'contains', 'is', 'after'
  value?: any;             // The value to compare
}
```

### Rule Object

```typescript
interface Rule {
  id: string;              // Unique rule identifier
  name: string;            // User-friendly rule name
  condition: RuleCondition;// The rule condition
  createdAt?: string;      // Creation timestamp
  updatedAt?: string;      // Last update timestamp
}
```

---

## 🧩 Components Guide

### Frontend Components

#### 1. **RulesPageComponent**
**Location**: `apps/frontend/src/app/pages/rules-page/`

**Purpose**: Main container for the entire rule builder

**Features**:
- Rule builder interface
- Live preview of matches
- Rule management (save/load)
- Validation and error display

#### 2. **RuleGroupComponent**
**Location**: `apps/frontend/src/app/components/rule-group/`

**Purpose**: Recursive component for handling AND/OR groups

**Features**:
- Recursive rendering for nested groups
- Add/remove conditions
- Toggle AND/OR operator

#### 3. **RuleConditionComponent**
**Location**: `apps/frontend/src/app/components/rule-condition/`

**Purpose**: Editor for a single condition

**Features**:
- Field selector with dynamic operators
- Appropriate input types based on field type
- Date picker for date fields
- Value validation

---

## 🔧 Services Guide

### RuleService
**Location**: `apps/frontend/src/app/services/rule.service.ts`

**Purpose**: HTTP client for backend API communication

**Key Methods**:
- `evaluateRule(condition)` - Evaluate a rule
- `getRules()` - Get all saved rules
- `saveRule(name, condition)` - Save a rule
- `deleteRule(id)` - Delete a rule
- `getFields()` - Get available fields

### RuleStateService
**Location**: `apps/frontend/src/app/services/rule-state.service.ts`

**Purpose**: Manages application state using RxJS

**Key Methods**:
- `setCurrentCondition(condition)` - Set current rule
- `getCurrentCondition()` - Get current rule
- `setFields(fields)` - Set available fields
- `getFields()` - Get available fields
- `resetCondition()` - Reset to empty rule

---

## 💻 Development

### Development Server Setup

```bash
# Start both frontend and backend
npm start

# Or start separately
npm run start:frontend  # Port 4200
npm run start:backend   # Port 3000

# Watch mode for development
npm run test:watch
```

### Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format

# Run tests
npm test

# Test coverage
npm run test:coverage
```

### Building for Production

```bash
# Build all apps
npm run build

# Build frontend only
npm run build:frontend

# Build backend only
npm run build:backend
```

---

## 🧪 Testing

### Test Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Files

- `libs/shared-types/src/lib/rule-validator.spec.ts` - Rule validation tests
- `libs/data-models/src/lib/filter-engine.spec.ts` - Filtering engine tests
- `apps/backend/src/app/storage.spec.ts` - Storage tests

---

## 🚀 Deployment

### Prerequisites for Deployment

- Ubuntu 20+ server
- Node.js 18+ installed
- Nginx installed
- SSH access to server

### Quick Deployment

See [QUICKSTART.md](./QUICKSTART.md) for step-by-step deployment instructions.

### Deployment Commands

```bash
# Build application
npm run build

# Deploy
./deploy.sh
```

---

## 🔐 Environment Variables

### Backend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | development | Environment mode |
| `HOST` | 0.0.0.0 | Server host address |
| `PORT` | 3000 | Server port |
| `CORS_ORIGIN` | http://localhost:4200 | CORS allowed origin |
| `RATE_LIMIT_MAX` | 100 | Global rate limit |
| `RATE_LIMIT_WINDOW` | 60000 | Rate limit window (ms) |

---

## 🆘 Troubleshooting

### Common Issues

#### Port already in use
```bash
# Find process using port
lsof -i :3000  # For backend
lsof -i :4200  # For frontend

# Kill process
kill -9 <PID>
```

#### CORS errors
Check backend CORS configuration in `apps/backend/src/main.ts`

#### Module not found errors
```bash
npm run build
npx nx reset
npm install
npm start
```

#### Build fails with memory error
```bash
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

---

## 📝 Contributing

### Development Workflow

1. Create a feature branch
2. Make changes and test locally
3. Commit with descriptive messages
4. Push and create pull request

### Code Style

- Use Prettier for formatting
- Use ESLint for linting
- TypeScript strict mode
- Angular best practices

## 📄 License

MIT License

---
