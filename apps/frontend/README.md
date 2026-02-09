# Frontend - Audience Rule Builder

Angular 19 application with Tailwind CSS for the Audience Rule Builder.

## Development

Start the development server:
```bash
npm run start:frontend
```

Or using NX directly:
```bash
nx serve frontend
```

The app will be available at http://localhost:4200

## Build

```bash
nx build frontend
```

The build artifacts will be stored in `dist/apps/frontend/`.

## Components

- **RuleBuilderComponent**: Main container component
- **RuleGroupComponent**: Recursive component for AND/OR groups
- **RuleConditionComponent**: Single condition editor
- **LivePreviewComponent**: Real-time matching results
- **SavedRulesListComponent**: Saved rules management

## Services

- **RuleService**: HTTP client for API communication
- **RuleStateService**: Manages current rule state

## Features

- Standalone components (no NgModules)
- Tailwind CSS for styling
- Reactive forms with validation
- Debounced API calls (300ms)
- Error handling and loading states
- Responsive design
