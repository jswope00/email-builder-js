import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

import react from '@vitejs/plugin-react-swc';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Allow base path to be configured via environment variable
// Default to '/email-builder-js/' for GitHub Pages, use '/' for root domain deployment
const basePath = process.env.VITE_BASE_PATH || '/email-builder-js/';

// Debug: log the base path being used (only in CI/build environments)
if (process.env.CI || process.env.GITHUB_ACTIONS) {
  console.log(`[Vite Config] Using base path: "${basePath}"`);
  console.log(`[Vite Config] VITE_BASE_PATH env var: "${process.env.VITE_BASE_PATH}"`);
}

export default defineConfig({
  plugins: [react()],
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
        find: '@usewaypoint/block-video-xml',
        replacement: path.resolve(__dirname, '../block-video-xml/src/index.tsx'),
      },
      {
        find: '@usewaypoint/block-therapeutic-update-xml',
        replacement: path.resolve(__dirname, '../block-therapeutic-update-xml/src/index.tsx'),
      },
      {
        find: '@usewaypoint/block-video-poster-xml',
        replacement: path.resolve(__dirname, '../block-video-poster-xml/src/index.tsx'),
      },
      {
        find: '@usewaypoint/block-featured-story-xml',
        replacement: path.resolve(__dirname, '../block-featured-story-xml/src/index.tsx'),
      },
      {
        find: '@usewaypoint/block-news-panel-xml',
        replacement: path.resolve(__dirname, '../block-news-panel-xml/src/index.tsx'),
      },
      {
        find: '@usewaypoint/block-blog-xml',
        replacement: path.resolve(__dirname, '../block-blog-xml/src/index.tsx'),
      },
      {
        find: '@usewaypoint/block-advertisement-728-90-xml',
        replacement: path.resolve(__dirname, '../block-advertisement-728-90-xml/src/index.tsx'),
      },
      {
        find: '@usewaypoint/block-advertisement-300-250-xml',
        replacement: path.resolve(__dirname, '../block-advertisement-300-250-xml/src/index.tsx'),
      },
      {
        find: '@usewaypoint/block-conference-advertisement-300-250-xml',
        replacement: path.resolve(__dirname, '../block-conference-advertisement-300-250-xml/src/index.tsx'),
      },
      {
        find: '@usewaypoint/block-daily-download-xml',
        replacement: path.resolve(__dirname, '../block-daily-download-xml/src/index.tsx'),
      },
      {
        find: '@usewaypoint/block-email-survey-xml',
        replacement: path.resolve(__dirname, '../block-email-survey-xml/src/index.tsx'),
      },
      {
        find: '@usewaypoint/rheumnow-xml-topic',
        replacement: path.resolve(__dirname, '../rheumnow-xml-topic/src/index.ts'),
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
      '@usewaypoint/block-video-xml',
      '@usewaypoint/block-therapeutic-update-xml',
      '@usewaypoint/block-video-poster-xml',
      '@usewaypoint/block-featured-story-xml',
      '@usewaypoint/block-news-panel-xml',
      '@usewaypoint/block-blog-xml',
      '@usewaypoint/block-advertisement-728-90-xml',
      '@usewaypoint/block-advertisement-300-250-xml',
      '@usewaypoint/block-conference-advertisement-300-250-xml',
      '@usewaypoint/block-daily-download-xml',
      '@usewaypoint/block-email-survey-xml',
      '@usewaypoint/rheumnow-xml-topic',
    ],
  },
});
