# Backend - Audience Rule Builder API

Fastify API server for the Audience Rule Builder.

## Development

Start the development server:
```bash
npm run start:backend
```

Or using NX directly:
```bash
nx serve backend
```

The API will be available at http://localhost:3000

## Build

```bash
nx build backend
```

The build artifacts will be stored in `dist/apps/backend/`.

## API Endpoints

- `GET /api` - Health check
- `POST /api/evaluate` - Evaluate rule and return matching contacts
- `GET /api/rules` - List all saved rules
- `POST /api/rules` - Save a new rule
- `DELETE /api/rules/:id` - Delete a rule
- `GET /api/fields` - Get available fields and operators

## Architecture

- **Fastify**: Fast web framework
- **CORS enabled**: Allows requests from frontend
- **In-memory storage**: Rules stored in memory (resets on restart)
- **Schema validation**: Request validation using Fastify schemas
- **TypeScript**: Full type safety

## Data

- 100 sample contacts with realistic data
- Filtering engine evaluates rule trees
- Supports nested AND/OR logic
- All field operators implemented
