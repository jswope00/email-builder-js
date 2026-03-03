var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}
// Create connection pool
export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // Connection pool settings
    max: 20, // Maximum number of clients in the pool
    idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection cannot be established
});
// Test connection on startup
pool.on('connect', () => {
    console.log('✅ Database connection established');
});
pool.on('error', (err) => {
    console.error('❌ Unexpected database error:', err);
});
// Helper function to test connection
export function testConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield pool.query('SELECT NOW()');
            console.log('Database connection test successful:', result.rows[0].now);
            return true;
        }
        catch (error) {
            console.error('Database connection test failed:', error);
            return false;
        }
    });
}
// Graceful shutdown
export function closePool() {
    return __awaiter(this, void 0, void 0, function* () {
        yield pool.end();
        console.log('Database connection pool closed');
    });
}
//# sourceMappingURL=connection.js.map