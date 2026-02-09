# Component Folder Structure - Visual Guide

## Directory Tree

```
c:\Chemist2U\apps\frontend\src\app\
│
├── 📁 components/                    # Reusable UI components
│   │
│   ├── 📁 navbar/                   # Navigation bar component
│   │   ├── 📄 navbar.component.ts   # Component logic & metadata
│   │   ├── 📄 navbar.component.html # Template markup
│   │   └── 📄 navbar.component.scss # Component styles
│   │
│   ├── 📁 rule-group/               # AND/OR logic group component
│   │   ├── 📄 rule-group.component.ts
│   │   ├── 📄 rule-group.component.html
│   │   └── 📄 rule-group.component.scss
│   │
│   └── 📁 rule-condition/           # Single condition editor
│       ├── 📄 rule-condition.component.ts
│       ├── 📄 rule-condition.component.html
│       └── 📄 rule-condition.component.scss
│
├── 📁 pages/                         # Page-level components
│   │
│   ├── 📁 rules-page/               # Rules management page
│   │   ├── 📄 rules-page.component.ts
│   │   ├── 📄 rules-page.component.html
│   │   └── 📄 rules-page.component.scss
│   │
│   └── 📁 contacts-page/            # Contacts filtering page
│       ├── 📄 contacts-page.component.ts
│       ├── 📄 contacts-page.component.html
│       └── 📄 contacts-page.component.scss
│
├── 📁 services/                      # Application services
│   ├── 📄 rule.service.ts           # Rule API service
│   └── 📄 rule-state.service.ts     # Rule state management
│
├── 📄 app.ts                         # Root component
├── 📄 app.html                       # Root template
├── 📄 app.css                        # Root styles
├── 📄 app.config.ts                  # App configuration
└── 📄 app.routes.ts                  # Route definitions
```

## Component Hierarchy

```
App (Root)
│
├── Navbar
│   └── RouterModule (Navigation)
│
└── Router Outlet
    │
    ├── /rules → Rules Page
    │   ├── Rule Name Input (Material)
    │   ├── Rule Group (Recursive)
    │   │   ├── AND/OR Toggle (Material Chip)
    │   │   ├── Rule Condition (Multiple)
    │   │   │   ├── Field Select (Material)
    │   │   │   ├── Operator Select (Material)
    │   │   │   └── Value Input (Material)
    │   │   └── Nested Rule Groups (Recursive)
    │   ├── Preview Stats (Material Card)
    │   └── Saved Rules List (Material Cards)
    │
    └── /contacts → Contacts Page
        ├── Filter Panel (Material Card)
        │   └── Rule Selector (Material Select)
        └── Contacts Table (Material Table)
```

## Import Path Patterns

### Components importing other components (same level):
```typescript
// rule-group imports rule-condition
import { RuleConditionComponent } from '../rule-condition/rule-condition.component';
```

### Pages importing components:
```typescript
// rules-page imports rule-group
import { RuleGroupComponent } from '../../components/rule-group/rule-group.component';
```

### Pages importing services:
```typescript
// rules-page imports services
import { RuleService } from '../../services/rule.service';
import { RuleStateService } from '../../services/rule-state.service';
```

### Root imports pages:
```typescript
// app.routes imports pages
import { RulesPageComponent } from './pages/rules-page/rules-page.component';
import { ContactsPageComponent } from './pages/contacts-page/contacts-page.component';
```

### Root imports components:
```typescript
// app imports navbar
import { NavbarComponent } from './components/navbar/navbar.component';
```

## File Naming Convention

All files follow Angular's standard naming convention:

```
[name].component.ts    # TypeScript class
[name].component.html  # HTML template
[name].component.scss  # SCSS styles
[name].service.ts      # Service class
```

## Advantages of This Structure

### 1. **Modularity** 🧩
Each component is a self-contained module with all its related files in one place.

### 2. **Scalability** 📈
Easy to add new features:
- New component? Create a new folder
- New test? Add it to the component folder
- New model? Add it to the component folder

### 3. **Maintainability** 🔧
- Quick to find what you need
- Clear relationships between files
- Easy to refactor

### 4. **Collaboration** 👥
- Multiple developers can work on different folders
- Clear ownership boundaries
- Reduced merge conflicts

### 5. **Angular CLI Ready** ⚡
- Matches Angular CLI generated structure
- Future-proof for Angular updates
- Compatible with standard tooling

## Quick Reference

| Location | Purpose | Examples |
|----------|---------|----------|
| `components/` | Reusable UI pieces | navbar, rule-group, rule-condition |
| `pages/` | Routable page views | rules-page, contacts-page |
| `services/` | Business logic & API | rule.service, rule-state.service |
| Root | App bootstrap | app.ts, app.routes.ts |

---
**Last Updated:** February 8, 2026
**Angular Version:** 21.1.0
**Pattern:** Feature-Based Organization
