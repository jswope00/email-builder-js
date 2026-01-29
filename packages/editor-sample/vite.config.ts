import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

import react from '@vitejs/plugin-react-swc';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Allow base path to be configured via environment variable
// Default to '/email-builder-js/' for GitHub Pages, use '/' for root domain deployment
const basePath = process.env.VITE_BASE_PATH || '/email-builder-js/';

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
    ],
  },
});
