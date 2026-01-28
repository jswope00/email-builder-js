# Database Setup

This directory contains database schema and migration files for the email builder PostgreSQL database.

## Quick Start

### 1. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE email_builder;

# Exit psql
\q
```

### 2. Run Schema

```bash
# Using psql
psql -U postgres -d email_builder -f schema.sql

# Or using connection string
psql $DATABASE_URL -f schema.sql
```

### 3. Run Migrations

```bash
# Run all migrations
psql -U postgres -d email_builder -f migrations/001_initial_schema.sql
```

## Environment Variables

Create a `.env` file in the root directory (it's already in .gitignore):

```env
DATABASE_URL=postgresql://user:password@localhost:5432/email_builder
```

**Example values:**
- Local: `postgresql://postgres:password@localhost:5432/email_builder`
- Docker: `postgresql://postgres:password@localhost:5433/email_builder`
- Remote: `postgresql://user:pass@example.com:5432/email_builder`

## Database Connection

The database connection string format:
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

Example:
```
postgresql://postgres:mypassword@localhost:5432/email_builder
```

## Schema Overview

### `email_templates` Table

- `id` - UUID primary key
- `name` - Template display name
- `slug` - URL-friendly identifier (unique)
- `description` - Optional description
- `configuration` - JSONB containing the full template configuration
- `created_at` - Timestamp when created
- `updated_at` - Timestamp when last updated (auto-updated)
- `created_by` - Optional user identifier
- `is_active` - Whether template is active

## Testing Connection

You can test the database connection with:

```bash
psql $DATABASE_URL -c "SELECT version();"
```

## Migration Strategy

Migrations are numbered sequentially:
- `001_initial_schema.sql` - Initial schema
- `002_*` - Future migrations

Always test migrations on a development database first!
