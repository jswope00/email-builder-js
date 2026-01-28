#!/usr/bin/env node

/**
 * Simple script to test PostgreSQL database connection
 * Usage: node database/test-connection.js
 * 
 * Requires DATABASE_URL environment variable or .env file
 */

const { Client } = require('pg');
require('dotenv').config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ Error: DATABASE_URL environment variable is not set');
  console.error('   Please set DATABASE_URL in your .env file or environment');
  console.error('   Example: DATABASE_URL=postgresql://user:password@localhost:5432/email_builder');
  process.exit(1);
}

const client = new Client({
  connectionString: DATABASE_URL,
});

async function testConnection() {
  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully!');

    // Test query
    const result = await client.query('SELECT version()');
    console.log('📊 PostgreSQL version:', result.rows[0].version.split(' ')[0] + ' ' + result.rows[0].version.split(' ')[1]);

    // Check if email_templates table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'email_templates'
      );
    `);

    if (tableCheck.rows[0].exists) {
      console.log('✅ email_templates table exists');
      
      // Count templates
      const countResult = await client.query('SELECT COUNT(*) FROM email_templates');
      console.log(`📦 Templates in database: ${countResult.rows[0].count}`);
    } else {
      console.log('⚠️  email_templates table does not exist');
      console.log('   Run: psql $DATABASE_URL -f database/schema.sql');
    }

    await client.end();
    console.log('👋 Connection closed');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.error('   Make sure PostgreSQL is running and DATABASE_URL is correct');
    } else if (error.code === '3D000') {
      console.error('   Database does not exist. Create it with: CREATE DATABASE email_builder;');
    } else if (error.code === '28P01') {
      console.error('   Authentication failed. Check your username and password in DATABASE_URL');
    }
    process.exit(1);
  }
}

testConnection();
