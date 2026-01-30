# Local Development Setup Guide

This guide will help new developers get the frontend and backend running locally.

## Prerequisites

Choose one of the following setups:

**Option 1: Full Docker Setup (Recommended for new developers)**
- **Docker** and **Docker Compose**
- **Git** (to clone the repository)

**Option 2: Local Development**
- **Node.js** 20+ and npm
- **PostgreSQL** 12+ installed and running (or Docker for PostgreSQL only)
- **Git** (to clone the repository)

## Quick Start: Full Docker Setup (Everything in Containers)

If you want to run everything in Docker containers (PostgreSQL + API + Frontend):

```bash
# 1. Clone the repository
git clone <repository-url>
cd email-builder-js

# 2. Start all services (PostgreSQL + API + Frontend)
docker compose up -d

# 3. Access the application
# Frontend: http://localhost
# API: http://localhost:3001/api
```

**For development with hot reload:**
```bash
# Use the development docker-compose file
docker compose -f docker-compose.dev.yml up
```

**Stop everything:**
```bash
docker compose down
# or for dev mode:
docker compose -f docker-compose.dev.yml down
```

**Note:** The production Docker setup builds optimized images. For development, use `docker-compose.dev.yml` which mounts your code and enables hot reload.

---

## Local Development Setup (Traditional)

If you prefer to run Node.js locally and only use Docker for PostgreSQL:

## Step 1: Clone and Install Dependencies

```bash
# Clone the repository (if not already done)
git clone <repository-url>
cd email-builder-js

# Install all dependencies (this uses npm workspaces)
npm install
```

## Step 2: Set Up PostgreSQL Database

You have two options: **Docker (Recommended)** or **Local PostgreSQL Installation**.

### Option A: Using Docker (Recommended)

If you have Docker installed, this is the easiest way to get PostgreSQL running:

```bash
# Start PostgreSQL container
docker compose up -d postgres

# Verify it's running
docker compose ps
```

The Docker container will:
- Use the official `postgres:16-alpine` image (lightweight and well-maintained)
- Automatically create the `email_builder` database
- Automatically run the schema migration on first startup
- Persist data in a Docker volume

**Default credentials** (used by Docker setup):
- User: `postgres`
- Password: `postgres`
- Database: `email_builder`
- Port: `5432`

**Note:** The schema will be automatically applied when the container starts for the first time.

### Option B: Local PostgreSQL Installation

If you prefer to run PostgreSQL locally:

#### 2.1 Create the Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE email_builder;

# Exit psql
\q
```

#### 2.2 Run the Database Schema

```bash
# Using psql with your connection string
psql postgresql://your_user:your_password@localhost:5432/email_builder -f database/schema.sql

# Or if you have DATABASE_URL set in your environment:
psql $DATABASE_URL -f database/schema.sql
```

### Docker Commands Reference

**For PostgreSQL only:**
```bash
# Start PostgreSQL
docker compose up -d postgres

# Stop PostgreSQL (keeps data)
docker compose stop postgres

# Stop and remove container (keeps data volume)
docker compose down

# Stop and remove everything including data
docker compose down -v

# View logs
docker compose logs -f postgres

# Connect to database via psql
docker compose exec postgres psql -U postgres -d email_builder
```

**For full stack (PostgreSQL + API + Frontend):**
```bash
# Start all services (production)
docker compose up -d

# Start all services (development with hot reload)
docker compose -f docker-compose.dev.yml up

# View logs
docker compose logs -f

# Rebuild containers after code changes
docker compose build

# Stop all services
docker compose down
```

## Step 3: Configure Environment Variables

Create a `.env` file in the **root directory** of the project:

```bash
# In the root of email-builder-js/
touch .env
```

Add the following environment variables to `.env`:

```env
# Database Configuration
# For Docker setup (default):
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/email_builder

# For local PostgreSQL, use your actual credentials:
# DATABASE_URL=postgresql://your_user:your_password@localhost:5432/email_builder

# Backend API Configuration
PORT=3001
CORS_ORIGIN=http://localhost:5173
NODE_ENV=development

# Frontend API URL (optional - defaults to http://localhost:3001/api)
VITE_API_URL=http://localhost:3001/api
```

**Important:** 
- If using Docker: Use `postgresql://postgres:postgres@localhost:5432/email_builder`
- If using local PostgreSQL: Replace with your actual PostgreSQL username, password, and port

## Step 4: Start the Backend API

Open a terminal and run:

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

**Keep this terminal running** - the API will automatically reload on code changes.

## Step 5: Start the Frontend (Editor)

Open a **new terminal** and run:

```bash
cd packages/editor-sample
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Keep this terminal running** - the frontend will automatically reload on code changes.

## Step 6: Access the Application

Open your browser and navigate to:

```
http://localhost:5173/email-builder-js/
```

The email builder editor should now be running and connected to the backend API.

## Verification

### Test the Backend API

In a new terminal, test that the API is working:

```bash
# Health check
curl http://localhost:3001/api/health

# List templates (should return empty array initially)
curl http://localhost:3001/api/templates
```

### Test the Frontend

1. Open http://localhost:5173/email-builder-js/
2. You should see the email builder interface
3. Try creating a new email template
4. The template should save to your PostgreSQL database

## Troubleshooting

### Database Connection Issues

**Error: "Failed to connect to database"**

**If using Docker:**
- Verify the container is running:
  ```bash
  docker compose ps
  ```
- Check container logs:
  ```bash
  docker compose logs postgres
  ```
- Restart the container:
  ```bash
  docker compose restart postgres
  ```
- Verify the connection:
  ```bash
  docker compose exec postgres psql -U postgres -d email_builder -c "SELECT 1;"
  ```

**If using local PostgreSQL:**
- Verify PostgreSQL is running:
  ```bash
  # macOS
  brew services list
  
  # Linux
  sudo systemctl status postgresql
  ```
- Check your `DATABASE_URL` in `.env` matches your PostgreSQL credentials
- Test the connection manually:
  ```bash
  psql $DATABASE_URL
  ```

### Port Already in Use

**Error: "Port 3001 is already in use"**

- Change the `PORT` in `.env` to a different port (e.g., `3002`)
- Update `CORS_ORIGIN` and `VITE_API_URL` accordingly

**Error: "Port 5173 is already in use"**

- Vite will automatically try the next available port
- Or specify a different port:
  ```bash
  cd packages/editor-sample
  npm run dev -- --port 5174
  ```

### Frontend Can't Connect to Backend

- Verify the backend is running on the port specified in `VITE_API_URL`
- Check browser console for CORS errors
- Ensure `CORS_ORIGIN` in backend `.env` matches your frontend URL

### Database Schema Not Found

- Make sure you ran the schema migration:
  ```bash
  psql $DATABASE_URL -f database/schema.sql
  ```
- Verify the table exists:
  ```bash
  psql $DATABASE_URL -c "\d email_templates"
  ```

## Development Workflow

### Making Changes

1. **Backend changes**: Edit files in `packages/email-builder-api/src/` - the server will auto-reload
2. **Frontend changes**: Edit files in `packages/editor-sample/src/` - Vite will hot-reload
3. **Block changes**: Edit files in `packages/block-*/src/` - you may need to rebuild:
   ```bash
   cd packages/block-<name>
   npm run build
   ```

### Rebuilding Packages

If you make changes to shared packages (like `email-builder` or blocks), rebuild them:

```bash
# From root directory
cd packages/email-builder
npm run build

# Or rebuild a specific block
cd packages/block-text
npm run build
```

## Project Structure

```
email-builder-js/
├── .env                    # Environment variables (create this)
├── packages/
│   ├── email-builder-api/  # Backend API (Express + PostgreSQL)
│   │   └── src/
│   ├── editor-sample/      # Frontend Editor (React + Vite)
│   │   └── src/
│   ├── email-builder/      # Core rendering library
│   └── block-*/            # Individual block components
└── database/
    └── schema.sql          # Database schema
```

## Quick Reference

### Start Everything (Local Development)

```bash
# Terminal 1: Backend
cd packages/email-builder-api && npm run dev

# Terminal 2: Frontend
cd packages/editor-sample && npm run dev
```

### Start Everything (Docker)

```bash
# Production (optimized builds)
docker compose up -d

# Development (hot reload)
docker compose -f docker-compose.dev.yml up
```

### Stop Everything

Press `Ctrl+C` in each terminal running the servers.

### Database Commands

```bash
# Connect to database
psql $DATABASE_URL

# List templates
SELECT id, name, slug, created_at FROM email_templates;

# View a template
SELECT * FROM email_templates WHERE slug = 'your-slug';
```

## Next Steps

- Read the [API documentation](packages/email-builder-api/README.md) for available endpoints
- Check out the [database setup guide](database/SETUP_INSTRUCTIONS.md) for more database details
- Explore the [editor sample code](packages/editor-sample/) to understand the frontend structure
