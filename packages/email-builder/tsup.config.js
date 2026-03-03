import { defineConfig } from 'tsup';
export default defineConfig({
    entry: ['src/index.ts'],
    outDir: 'dist',
    format: ['cjs', 'esm'],
    dts: true,
    // Bundle this block so dist does not have an unresolved external import when consumed by editor-sample build
    noExternal: ['@nattusia/block-email-survey-xml', '@nattusia/block-xml-feed'],
});
//# sourceMappingURL=tsup.config.js.map