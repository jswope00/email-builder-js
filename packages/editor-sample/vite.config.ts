import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

import react from '@vitejs/plugin-react-swc';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Base path for assets and routes. Use '/' for root deployment (assets at /assets).
// Set VITE_BASE_PATH e.g. to '/email-builder-js/' if app is served under a subpath.
const basePath = process.env.VITE_BASE_PATH || '/';

// Debug: log the base path being used (only in CI/build environments)
if (process.env.CI || process.env.GITHUB_ACTIONS) {
  console.log(`[Vite Config] Using base path: "${basePath}"`);
  console.log(`[Vite Config] VITE_BASE_PATH env var: "${process.env.VITE_BASE_PATH}"`);
}

export default defineConfig({
  plugins: [react()],
  base: basePath,
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    hmr: {
      host: 'localhost',
    },
    cors: true,
    origin: 'http://116.203.204.172',
  },
  resolve: {
    preserveSymlinks: false,
    alias: {
      '@usewaypoint/email-builder': path.resolve(__dirname, '../email-builder/src/index.ts'),
      '@usewaypoint/document-core': path.resolve(__dirname, '../document-core/src/index.ts'),
      '@usewaypoint/block-avatar': path.resolve(__dirname, '../block-avatar/src/index.tsx'),
      '@usewaypoint/block-button': path.resolve(__dirname, '../block-button/src/index.tsx'),
      '@usewaypoint/block-columns-container': path.resolve(__dirname, '../block-columns-container/src/index.tsx'),
      '@usewaypoint/block-container': path.resolve(__dirname, '../block-container/src/index.tsx'),
      '@usewaypoint/block-divider': path.resolve(__dirname, '../block-divider/src/index.tsx'),
      '@usewaypoint/block-heading': path.resolve(__dirname, '../block-heading/src/index.tsx'),
      '@usewaypoint/block-html': path.resolve(__dirname, '../block-html/src/index.tsx'),
      '@usewaypoint/block-image': path.resolve(__dirname, '../block-image/src/index.tsx'),
      '@usewaypoint/block-spacer': path.resolve(__dirname, '../block-spacer/src/index.tsx'),
      '@usewaypoint/block-text': path.resolve(__dirname, '../block-text/src/index.tsx'),
      '@usewaypoint/block-therapeutic-update-xml': path.resolve(__dirname, '../block-therapeutic-update-xml/src/index.tsx'),
      '@usewaypoint/block-video-xml': path.resolve(__dirname, '../block-video-xml/src/index.tsx'),
      '@usewaypoint/block-featured-story-xml': path.resolve(__dirname, '../block-featured-story-xml/src/index.tsx'),
      '@usewaypoint/block-news-panel-xml': path.resolve(__dirname, '../block-news-panel-xml/src/index.tsx'),
      '@usewaypoint/block-blog-xml': path.resolve(__dirname, '../block-blog-xml/src/index.tsx'),
      '@usewaypoint/block-advertisement-728-90-xml': path.resolve(__dirname, '../block-advertisement-728-90-xml/src/index.tsx'),
      '@usewaypoint/block-advertisement-300-250-xml': path.resolve(__dirname, '../block-advertisement-300-250-xml/src/index.tsx'),
      '@usewaypoint/block-conference-advertisement-300-250-xml': path.resolve(__dirname, '../block-conference-advertisement-300-250-xml/src/index.tsx'),
      '@usewaypoint/block-daily-download-xml': path.resolve(__dirname, '../block-daily-download-xml/src/index.tsx'),
    },
    dedupe: [
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
      '@usewaypoint/block-therapeutic-update-xml',
      '@usewaypoint/block-video-xml',
      '@usewaypoint/block-featured-story-xml',
      '@usewaypoint/block-news-panel-xml',
      '@usewaypoint/block-blog-xml',
      '@usewaypoint/block-advertisement-728-90-xml',
      '@usewaypoint/block-advertisement-300-250-xml',
      '@usewaypoint/block-conference-advertisement-300-250-xml',
      '@usewaypoint/block-daily-download-xml',
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
      '@usewaypoint/block-therapeutic-update-xml',
      '@usewaypoint/block-video-xml',
      '@usewaypoint/block-featured-story-xml',
      '@usewaypoint/block-news-panel-xml',
      '@usewaypoint/block-blog-xml',
      '@usewaypoint/block-advertisement-728-90-xml',
      '@usewaypoint/block-advertisement-300-250-xml',
      '@usewaypoint/block-conference-advertisement-300-250-xml',
      '@usewaypoint/block-daily-download-xml',
    ],
  },
});
