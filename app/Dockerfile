# ─────────────────────────────────────────────────────────────
# Stage 1: Base with Corepack Enabled
# ─────────────────────────────────────────────────────────────
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ─────────────────────────────────────────────────────────────
# Stage 2: Dependencies
# ─────────────────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app

# Copy root package files for monorepo setup
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Copy frontend package.json to its directory
COPY frontend/package.json ./frontend/

# Install dependencies without frozen lockfile
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
  pnpm install

# ─────────────────────────────────────────────────────────────
# Stage 3: Build the application
# ─────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Copy frontend source code
COPY frontend ./frontend/

# Set Next.js telemetry to disabled and optimize build
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Build the Next.js application with enhanced caching
WORKDIR /app/frontend
RUN --mount=type=cache,target=/app/frontend/.next/cache \
  --mount=type=cache,target=/app/frontend/node_modules/.cache \
  pnpm build

# ─────────────────────────────────────────────────────────────
# Stage 4: Runner (Production Image)
# ─────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

# Set production environment variables
ARG APP_ENV=production
ENV NODE_ENV=production
ENV NEXT_PUBLIC_APP_ENV=$APP_ENV
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

# Create a non-root user for security
RUN addgroup --system node_group && adduser --system node_user --ingroup node_group
RUN chown -R node_user:node_group /app

# Based on the actual output structure:
# 1. Copy the entire standalone directory first
COPY --from=builder /app/frontend/.next/standalone/ ./
# 2. Copy the static files to the correct location for frontend subdirectory
COPY --from=builder /app/frontend/.next/static ./frontend/.next/static
# 3. Copy public assets
COPY --from=builder /app/frontend/public ./frontend/public

USER node_user
# Expose port and start the server
EXPOSE 3000

# Start the server - adjusted for monorepo structure
CMD ["node", "frontend/server.js"]
