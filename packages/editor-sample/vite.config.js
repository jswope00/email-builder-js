import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react-swc';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Resolve workspace packages from source so that editor-sample build never pulls in email-builder's dist
const emailBuilderSource = path.resolve(__dirname, '../email-builder/src/index.ts');
const blockEmailSurveyXmlSource = path.resolve(__dirname, '../block-email-survey-xml/src/index.tsx');
const blockXmlFeedSource = path.resolve(__dirname, '../block-xml-feed/src/index.tsx');
// Base path for assets. Use '/' for root (no redirect; scripts at /assets/).
// Set VITE_BASE_PATH to e.g. '/email-builder-js/' if app is served under a subpath.
const basePath = process.env.VITE_BASE_PATH || '/';
// Debug: log the base path being used (only in CI/build environments)
if (process.env.CI || process.env.GITHUB_ACTIONS) {
    console.log(`[Vite Config] Using base path: "${basePath}"`);
    console.log(`[Vite Config] VITE_BASE_PATH env var: "${process.env.VITE_BASE_PATH}"`);
}
export default defineConfig({
    plugins: [
        react(),
        {
            name: 'resolve-workspace-from-source',
            enforce: 'pre',
            resolveId(id, _importer) {
                if (id === '@usewaypoint/email-builder' || id.startsWith('@usewaypoint/email-builder/')) {
                    return emailBuilderSource;
                }
                if (id === '@nattusia/block-email-survey-xml' || id.startsWith('@nattusia/block-email-survey-xml/')) {
                    return blockEmailSurveyXmlSource;
                }
                if (id === '@nattusia/block-xml-feed' || id.startsWith('@nattusia/block-xml-feed/')) {
                    return blockXmlFeedSource;
                }
                // Already resolved to dist path - redirect to source
                const n = id.replace(/\\/g, '/');
                if (n.includes('email-builder/dist/') || n.endsWith('email-builder/dist/index.mjs') || n.endsWith('email-builder/dist/index.js')) {
                    return emailBuilderSource;
                }
                return null;
            },
        },
    ],
    base: basePath,
    resolve: {
        alias: [
            {
                find: '@usewaypoint/email-builder',
                replacement: path.resolve(__dirname, '../email-builder/src/index.ts'),
            },
            {
                find: '@usewaypoint/document-core',
                replacement: path.resolve(__dirname, '../document-core/src/index.ts'),
            },
            {
                find: '@usewaypoint/block-avatar',
                replacement: path.resolve(__dirname, '../block-avatar/src/index.tsx'),
            },
            {
                find: '@usewaypoint/block-button',
                replacement: path.resolve(__dirname, '../block-button/src/index.tsx'),
            },
            {
                find: '@usewaypoint/block-columns-container',
                replacement: path.resolve(__dirname, '../block-columns-container/src/index.tsx'),
            },
            {
                find: '@usewaypoint/block-container',
                replacement: path.resolve(__dirname, '../block-container/src/index.tsx'),
            },
            {
                find: '@usewaypoint/block-divider',
                replacement: path.resolve(__dirname, '../block-divider/src/index.tsx'),
            },
            {
                find: '@usewaypoint/block-heading',
                replacement: path.resolve(__dirname, '../block-heading/src/index.tsx'),
            },
            {
                find: '@usewaypoint/block-html',
                replacement: path.resolve(__dirname, '../block-html/src/index.tsx'),
            },
            {
                find: '@usewaypoint/block-image',
                replacement: path.resolve(__dirname, '../block-image/src/index.tsx'),
            },
            {
                find: '@usewaypoint/block-spacer',
                replacement: path.resolve(__dirname, '../block-spacer/src/index.tsx'),
            },
            {
                find: '@usewaypoint/block-text',
                replacement: path.resolve(__dirname, '../block-text/src/index.tsx'),
            },
            {
                find: '@nattusia/block-email-survey-xml',
                replacement: path.resolve(__dirname, '../block-email-survey-xml/src/index.tsx'),
            },
            {
                find: '@nattusia/block-xml-feed',
                replacement: path.resolve(__dirname, '../block-xml-feed/src/index.tsx'),
            },
        ],
    },
    optimizeDeps: {
        exclude: [
            '@usewaypoint/email-builder',
            '@usewaypoint/document-core',
            '@usewaypoint/block-avatar',
            '@usewaypoint/block-button',
            '@usewaypoint/block-columns-container',
            '@usewaypoint/block-container',
            '@usewaypoint/block-divider',
            '@usewaypoint/block-heading',
            '@usewaypoint/block-html',
            '@usewaypoint/block-image',
            '@usewaypoint/block-spacer',
            '@usewaypoint/block-text',
            '@nattusia/block-email-survey-xml',
            '@nattusia/block-xml-feed',
        ],
    },
});
//# sourceMappingURL=vite.config.js.map