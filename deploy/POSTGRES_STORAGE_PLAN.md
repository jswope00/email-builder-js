# PostgreSQL Storage Backend - Implementation Plan

## Overview
Add PostgreSQL database storage for email templates to replace the current file-based system where templates are stored in `.ts` files.

## Current State
- Templates are stored as TypeScript files in `packages/editor-sample/src/getConfiguration/sample/`
- Templates are loaded via `getConfiguration()` function based on URL hash (`#sample/template-name`)
- Users manually copy JSON from editor and save to `.ts` files
- No persistence or versioning
- No API layer

## Goals
1. Store email templates in PostgreSQL database
2. Create REST API for CRUD operations on templates
3. Update editor-sample to load/save templates from API
4. Maintain backward compatibility with existing file-based templates
5. Add template management UI (list, create, update, delete)

---

## Architecture

### 1. Database Schema

```sql
-- Email templates table
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL, -- URL-friendly identifier
  description TEXT,
  configuration JSONB NOT NULL, -- The full TEditorConfiguration JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255), -- Optional: user identifier
  is_active BOOLEAN DEFAULT true,
  
  CONSTRAINT valid_configuration CHECK (configuration ? 'root')
);

-- Indexes for performance
CREATE INDEX idx_email_templates_slug ON email_templates(slug);
CREATE INDEX idx_email_templates_active ON email_templates(is_active) WHERE is_active = true;
CREATE INDEX idx_email_templates_created_at ON email_templates(created_at DESC);

-- Template versions (optional, for history/rollback)
CREATE TABLE email_template_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID NOT NULL REFERENCES email_templates(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  configuration JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by VARCHAR(255),
  
  UNIQUE(template_id, version_number)
);

CREATE INDEX idx_template_versions_template_id ON email_template_versions(template_id, version_number DESC);
```

### 2. Backend API Package

**New Package:** `packages/email-builder-api/`

Structure:
```
packages/email-builder-api/
├── src/
│   ├── index.ts                 # Main server entry
│   ├── routes/
│   │   ├── templates.ts         # Template CRUD routes
│   │   └── health.ts            # Health check
│   ├── db/
│   │   ├── connection.ts        # PostgreSQL connection pool
│   │   ├── migrations/          # Database migrations
│   │   └── queries.ts           # SQL queries
│   ├── types/
│   │   └── template.ts          # TypeScript types
│   ├── middleware/
│   │   ├── auth.ts              # Optional: authentication
│   │   └── validation.ts       # Request validation
│   └── utils/
│       └── errors.ts            # Error handling
├── package.json
└── tsconfig.json
```

**API Endpoints:**

```
GET    /api/templates              # List all templates
GET    /api/templates/:slug       # Get template by slug
POST   /api/templates              # Create new template
PUT    /api/templates/:slug       # Update template
DELETE /api/templates/:slug       # Delete template
GET    /api/templates/:slug/versions  # Get template versions (if implemented)
```

**Technology Stack Options:**
- **Option A:** Express.js + pg (PostgreSQL client) - Simple, lightweight
- **Option B:** Fastify + pg - Faster, modern
- **Option C:** tRPC - Type-safe, if using TypeScript throughout

**Recommended:** Express.js for simplicity and wide adoption

### 3. Frontend Integration

**Update `packages/editor-sample/src/getConfiguration/index.tsx`:**

```typescript
// Support multiple sources:
// 1. #sample/name - File-based (backward compatible)
// 2. #template/:slug - Database templates
// 3. #code/... - URL-encoded JSON (existing)

async function getConfiguration(template: string): Promise<TEditorConfiguration> {
  // Database template
  if (template.startsWith('#template/')) {
    const slug = template.replace('#template/', '');
    return await fetchTemplateFromAPI(slug);
  }
  
  // Existing file-based (backward compatible)
  if (template.startsWith('#sample/')) {
    // ... existing code
  }
  
  // URL-encoded (existing)
  if (template.startsWith('#code/')) {
    // ... existing code
  }
  
  return EMPTY_EMAIL_MESSAGE;
}
```

**New Components:**
- `SaveTemplateDialog` - Save current template to database
- `TemplateList` - List all templates from database
- `TemplateSelector` - Dropdown/selector for templates

**Update `EditorContext.tsx`:**
- Add `saveTemplate()` function
- Add `loadTemplate()` function
- Add loading/error states

---

## Implementation Steps

### Phase 1: Database Setup
1. ✅ Create database schema SQL file
2. ✅ Set up migration system (e.g., node-pg-migrate or simple SQL files)
3. ✅ Create `.env` file for database connection
4. ✅ Test database connection

### Phase 2: Backend API
1. ✅ Create `packages/email-builder-api/` package
2. ✅ Set up Express.js server
3. ✅ Implement database connection pool
4. ✅ Create template CRUD routes
5. ✅ Add request validation (Zod schemas)
6. ✅ Add error handling
7. ✅ Add CORS middleware for editor-sample
8. ✅ Add API documentation (OpenAPI/Swagger)

### Phase 3: Frontend - Load Templates
1. ✅ Create API client utility (`src/api/templates.ts`)
2. ✅ Update `getConfiguration()` to support `#template/:slug`
3. ✅ Update `SamplesDrawer` to show database templates
4. ✅ Add loading states and error handling
5. ✅ Test loading templates from database

### Phase 4: Frontend - Save Templates
1. ✅ Create `SaveTemplateDialog` component
2. ✅ Add "Save" button to toolbar
3. ✅ Implement save functionality in `EditorContext`
4. ✅ Add success/error notifications
5. ✅ Handle slug generation/validation

### Phase 5: Template Management UI
1. ✅ Create template list view
2. ✅ Add "New Template" button
3. ✅ Add "Delete Template" button
4. ✅ Add "Duplicate Template" functionality
5. ✅ Add template search/filter

### Phase 6: Migration & Polish
1. ✅ Create migration script to import existing `.ts` files to database
2. ✅ Add template versioning (optional)
3. ✅ Add authentication/authorization (if needed)
4. ✅ Add tests
5. ✅ Update documentation

---

## File Structure Changes

### New Files
```
packages/email-builder-api/
  (entire new package)

packages/editor-sample/src/
  api/
    templates.ts              # API client
  components/
    SaveTemplateDialog.tsx    # Save dialog
    TemplateList.tsx          # Template list view
    TemplateSelector.tsx       # Template dropdown
```

### Modified Files
```
packages/editor-sample/src/
  getConfiguration/
    index.tsx                 # Add API template loading
  documents/editor/
    EditorContext.tsx         # Add save/load functions
  App/
    SamplesDrawer/
      index.tsx               # Show database templates
    TemplatePanel/
      index.tsx               # Add Save button
```

---

## Configuration

### Environment Variables

**Backend (`packages/email-builder-api/.env`):**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/email_builder
PORT=3001
NODE_ENV=development
```

**Frontend (`packages/editor-sample/.env`):**
```env
VITE_API_URL=http://localhost:3001/api
```

---

## API Request/Response Examples

### Create Template
```typescript
POST /api/templates
Content-Type: application/json

{
  "name": "RheumNow Daily",
  "slug": "rheumnow-daily",
  "description": "Daily newsletter template",
  "configuration": {
    "root": { ... }
  }
}

Response: 201 Created
{
  "id": "uuid",
  "name": "RheumNow Daily",
  "slug": "rheumnow-daily",
  "created_at": "2024-01-01T00:00:00Z",
  ...
}
```

### Get Template
```typescript
GET /api/templates/rheumnow-daily

Response: 200 OK
{
  "id": "uuid",
  "name": "RheumNow Daily",
  "slug": "rheumnow-daily",
  "configuration": { ... }
}
```

### List Templates
```typescript
GET /api/templates

Response: 200 OK
[
  {
    "id": "uuid",
    "name": "RheumNow Daily",
    "slug": "rheumnow-daily",
    "description": "...",
    "created_at": "...",
    "updated_at": "..."
  },
  ...
]
```

---

## Migration Strategy

### Option 1: One-time Import Script
Create a script to read all `.ts` files and import them:
```typescript
// scripts/import-templates.ts
import fs from 'fs';
import path from 'path';
import { createClient } from '@usewaypoint/email-builder-api';

// Read all .ts files from sample directory
// Parse and import to database
```

### Option 2: Keep Files as Fallback
- Keep existing `.ts` files
- Prefer database templates
- Fall back to files if API unavailable

---

## Security Considerations

1. **Input Validation:** Validate all JSON configurations against schema
2. **SQL Injection:** Use parameterized queries (pg library handles this)
3. **CORS:** Configure CORS for editor-sample origin only
4. **Rate Limiting:** Add rate limiting for API endpoints
5. **Authentication:** Add auth if multi-user (JWT, session, etc.)

---

## Testing Strategy

1. **Unit Tests:** API routes, database queries
2. **Integration Tests:** API + Database
3. **E2E Tests:** Frontend save/load flow
4. **Migration Tests:** Import script validation

---

## Future Enhancements

1. **Template Versioning:** Full history with rollback
2. **Template Categories/Tags:** Organize templates
3. **Template Sharing:** Public/private templates
4. **Template Variables:** Support for dynamic content
5. **Template Preview Images:** Screenshot generation
6. **Bulk Operations:** Import/export multiple templates

---

## Estimated Effort

- **Phase 1 (Database):** 2-4 hours
- **Phase 2 (Backend API):** 8-12 hours
- **Phase 3 (Frontend Load):** 4-6 hours
- **Phase 4 (Frontend Save):** 4-6 hours
- **Phase 5 (Management UI):** 6-8 hours
- **Phase 6 (Migration & Polish):** 4-6 hours

**Total:** ~28-42 hours

---

## Questions to Consider

1. **Authentication:** Do you need user accounts, or single-user system?
2. **Deployment:** Where will the API be hosted? (Same server, separate, cloud)
3. **Database Hosting:** Self-hosted PostgreSQL or managed service?
4. **Backward Compatibility:** Keep `.ts` files or fully migrate?
5. **Versioning:** Need template history/rollback?
