# Database Setup Instructions

## Phase 1: Database Setup - Complete ✅

The database schema and migration files have been created. Follow these steps to set up your PostgreSQL database.

## Prerequisites

1. **PostgreSQL installed** (version 12+ recommended)
   - macOS: `brew install postgresql@14`
   - Linux: `sudo apt-get install postgresql`
   - Windows: Download from [postgresql.org](https://www.postgresql.org/download/)

2. **PostgreSQL running**
   ```bash
   # macOS (Homebrew)
   brew services start postgresql@14
   
   # Linux (systemd)
   sudo systemctl start postgresql
   ```

## Step 1: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE email_builder;

# Exit psql
\q
```

## Step 2: Set Environment Variable

Create a `.env` file in the root directory:

```bash
# In the root of email-builder-js/
echo "DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/email_builder" > .env
```

Replace:
- `postgres` with your PostgreSQL username
- `yourpassword` with your PostgreSQL password
- `5432` with your PostgreSQL port (if different)
- `email_builder` with your database name (if different)

## Step 3: Run Schema

```bash
# Using psql directly
psql $DATABASE_URL -f database/schema.sql

# Or if DATABASE_URL is not set in shell, use inline:
psql postgresql://postgres:password@localhost:5432/email_builder -f database/schema.sql
```

## Step 4: Verify Setup

You can verify the setup by checking if the table exists:

```bash
psql $DATABASE_URL -c "\d email_templates"
```

You should see the table structure.

## Step 5: Test Connection (Optional)

If you have `pg` and `dotenv` npm packages installed, you can test the connection:

```bash
# Install dependencies (if not already installed)
npm install pg dotenv

# Run test script
node database/test-connection.js
```

## Troubleshooting

### Connection Refused
- Make sure PostgreSQL is running: `brew services list` (macOS) or `sudo systemctl status postgresql` (Linux)
- Check your connection string (host, port, username, password)

### Database Does Not Exist
- Run: `CREATE DATABASE email_builder;` in psql

### Authentication Failed
- Check your username and password in DATABASE_URL
- Try: `psql -U postgres` to test your credentials

### Permission Denied
- Make sure your PostgreSQL user has CREATE privileges
- You may need to run as superuser: `psql -U postgres`

## Next Steps

Once the database is set up, you can proceed to **Phase 2: Backend API** which will:
- Create the API package
- Set up Express.js server
- Implement database connection
- Create CRUD routes for templates

## Quick Reference

```bash
# Connect to database
psql $DATABASE_URL

# List tables
\dt

# Describe table
\d email_templates

# Count templates
SELECT COUNT(*) FROM email_templates;

# View all templates
SELECT id, name, slug, created_at FROM email_templates;
```
