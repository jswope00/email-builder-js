# Quick Start Guide

## Phase 2: Backend API - Complete ✅

The API package has been created with all CRUD operations for email templates.

## Setup Steps

### 1. Install Dependencies

From the root directory:
```bash
npm install
```

Or from the API package:
```bash
cd packages/email-builder-api
npm install
```

### 2. Set Environment Variables

Create a `.env` file in the root directory (or in `packages/email-builder-api/`):

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/email_builder
PORT=3001
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development
```

**Important:** Make sure your PostgreSQL database is set up and the schema has been run (see `database/SETUP_INSTRUCTIONS.md`).

### 3. Start the API Server

**Development mode (with hot reload):**
```bash
cd packages/email-builder-api
npm run dev
```

You should see:
```
✅ Database connection established
🚀 Server running on http://localhost:3001
📊 Health check: http://localhost:3001/api/health
📧 Templates API: http://localhost:3001/api/templates
```

### 4. Test the API

**Health Check:**
```bash
curl http://localhost:3001/api/health
```

**List Templates:**
```bash
curl http://localhost:3001/api/templates
```

**Create a Template:**
```bash
curl -X POST http://localhost:3001/api/templates \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Template",
    "slug": "test-template",
    "description": "A test template",
    "configuration": {
      "root": {
        "type": "EmailLayout",
        "data": {
          "backdropColor": "#F5F5F5",
          "canvasColor": "#FFFFFF",
          "textColor": "#262626",
          "fontFamily": "MODERN_SANS",
          "childrenIds": []
        }
      }
    }
  }'
```

**Get a Template:**
```bash
curl http://localhost:3001/api/templates/test-template
```

## API Endpoints Summary

- `GET /api/health` - Health check
- `GET /api/templates` - List all templates
- `GET /api/templates/:slug` - Get template by slug
- `POST /api/templates` - Create new template
- `PUT /api/templates/:slug` - Update template
- `DELETE /api/templates/:slug` - Delete template (soft delete)

## Troubleshooting

### Database Connection Error
- Make sure PostgreSQL is running
- Verify `DATABASE_URL` is correct
- Check that the database exists: `psql -l | grep email_builder`
- Verify schema has been run: `psql $DATABASE_URL -c "\d email_templates"`

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using port 3001: `lsof -ti:3001 | xargs kill`

### CORS Errors
- Make sure `CORS_ORIGIN` matches your frontend URL
- Default is `http://localhost:5173` (Vite dev server)

## Next Steps

Once the API is running, proceed to **Phase 3: Frontend Integration** to:
- Update editor-sample to load templates from API
- Add save functionality
- Create template management UI
