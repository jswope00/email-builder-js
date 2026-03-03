var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { testConnection, closePool } from './db/connection';
import { errorHandler } from './utils/errors';
import templatesRouter from './routes/templates';
import healthRouter from './routes/health';
import authRouter from './routes/auth';
import { requireAuth } from './middleware/auth';
import mailchimpRouter from './routes/mailchimp';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3001;
// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173', // Default Vite dev server
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Request logging (simple)
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
    next();
});
// Routes
app.use('/api/health', healthRouter);
app.use('/api/auth', authRouter);
app.use('/api/templates', requireAuth, templatesRouter);
app.use('/api/mailchimp', requireAuth, mailchimpRouter);
// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'Email Builder API',
        version: '0.0.1',
        endpoints: {
            health: '/api/health',
            templates: '/api/templates',
            mailchimp: '/api/mailchimp',
        },
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        code: 'NOT_FOUND',
        path: req.path,
    });
});
// Error handler (must be last)
app.use(errorHandler);
// Start server
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Test database connection
            const dbConnected = yield testConnection();
            if (!dbConnected) {
                console.error('❌ Failed to connect to database. Exiting...');
                process.exit(1);
            }
            // Start HTTP server
            app.listen(PORT, () => {
                console.log(`🚀 Server running on http://localhost:${PORT}`);
                console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
                console.log(`📧 Templates API: http://localhost:${PORT}/api/templates`);
                console.log(`📬 Mailchimp API: http://localhost:${PORT}/api/mailchimp`);
            });
        }
        catch (error) {
            console.error('❌ Failed to start server:', error);
            process.exit(1);
        }
    });
}
// Graceful shutdown
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('SIGTERM received, shutting down gracefully...');
    yield closePool();
    process.exit(0);
}));
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('SIGINT received, shutting down gracefully...');
    yield closePool();
    process.exit(0);
}));
// Start the server
startServer();
//# sourceMappingURL=index.js.map