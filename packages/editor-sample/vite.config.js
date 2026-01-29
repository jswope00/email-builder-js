import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// Allow base path to be configured via environment variable
// Default to '/email-builder-js/' for GitHub Pages, use '/' for root domain deployment
const basePath = process.env.VITE_BASE_PATH || '/email-builder-js/';

// Debug: log the base path being used (only in CI/build environments)
if (process.env.CI || process.env.GITHUB_ACTIONS) {
  console.log(`[Vite Config JS] Using base path: "${basePath}"`);
  console.log(`[Vite Config JS] VITE_BASE_PATH env var: "${process.env.VITE_BASE_PATH}"`);
}

export default defineConfig({
    plugins: [react()],
    base: basePath,
});
//# sourceMappingURL=vite.config.js.map