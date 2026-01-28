# Email Builder API

REST API for storing and managing email templates in PostgreSQL.

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file in the package root or use environment variables:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/email_builder
PORT=3001
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

### 3. Start Server

**Development (with hot reload):**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

## API Endpoints

### Health Check
```
GET /api/health
```

### Templates

#### List Templates
```
GET /api/templates
```

Response:
```json
[
  {
    "id": "uuid",
    "name": "Template Name",
    "slug": "template-slug",
    "description": "Description",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z",
    "is_active": true
  }
]
```

#### Get Template
```
GET /api/templates/:slug
```

Response:
```json
{
  "id": "uuid",
  "name": "Template Name",
  "slug": "template-slug",
  "description": "Description",
  "configuration": { ... },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "is_active": true
}
```

#### Create Template
```
POST /api/templates
Content-Type: application/json

{
  "name": "Template Name",
  "slug": "template-slug",
  "description": "Optional description",
  "configuration": { ... }
}
```

#### Update Template
```
PUT /api/templates/:slug
Content-Type: application/json

{
  "name": "Updated Name",
  "configuration": { ... }
}
```

#### Delete Template
```
DELETE /api/templates/:slug
```

## Development

The API uses:
- **Express.js** - Web framework
- **pg** - PostgreSQL client
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing
- **tsx** - TypeScript execution (dev)

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

Common error codes:
- `VALIDATION_ERROR` - Request validation failed
- `NOT_FOUND` - Resource not found
- `CONFLICT` - Resource conflict (e.g., duplicate slug)
- `INTERNAL_ERROR` - Server error
