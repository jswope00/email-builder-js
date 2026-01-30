# Backend API Dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy root package files
COPY package.json package-lock.json* ./

# Copy API package.json
COPY packages/email-builder-api/package.json ./packages/email-builder-api/

# Install dependencies (npm workspaces will handle it)
RUN npm ci --workspace=packages/email-builder-api || npm install

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/package-lock.json* ./package-lock.json

# Copy source code
COPY packages/email-builder-api ./packages/email-builder-api
COPY tsconfig.json* ./

# Build the API
WORKDIR /app/packages/email-builder-api
RUN npm run build

# Production stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built application and dependencies
COPY --from=builder /app/packages/email-builder-api/dist ./dist
COPY --from=builder /app/packages/email-builder-api/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the server
WORKDIR /app
CMD ["node", "dist/index.js"]
