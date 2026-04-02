import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,
  // Bundle all @usewaypoint/* workspace packages into the dist so that EC2
  // only needs to install real npm packages (react, express, pg, etc.).
  // Without this the server imports the published npm version of email-builder
  // which is missing the custom blocks (FeaturedStoryXml, TherapeuticUpdateXml …)
  // and renderToStaticMarkup throws "Cannot read properties of undefined (reading 'Component')".
  noExternal: [/@usewaypoint\/.*/],
});
