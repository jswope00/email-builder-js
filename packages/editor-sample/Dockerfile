# Frontend Editor Dockerfile
# Using Debian-based image instead of Alpine to avoid Rollup native module issues
FROM node:20 AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy root package files
COPY package.json package-lock.json* ./

# Copy editor-sample package.json
COPY packages/editor-sample/package.json ./packages/editor-sample/

# Install dependencies (npm workspaces will handle it)
RUN npm ci || npm install

# Build stage
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json
COPY --from=deps /app/package-lock.json* ./package-lock.json

# Copy source code (need all packages for workspace dependencies)
COPY packages ./packages
COPY tsconfig.json* ./

# Build the frontend
WORKDIR /app/packages/editor-sample
ENV VITE_API_URL=http://localhost:3001/api
RUN npm run build

# Production stage with nginx
FROM nginx:alpine AS runner

# Copy built files
COPY --from=builder /app/packages/editor-sample/dist /usr/share/nginx/html

# Copy nginx configuration
COPY packages/editor-sample/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
