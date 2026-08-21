# Repro: Turbopack 16.1 serverExternalPackages symlinks break in multi-stage
# Docker builds when .next is copied to a different path depth.
#
# docker build -t repro . && docker run -p 3000:3000 repro

FROM node:22-alpine AS builder
WORKDIR /workspace

# Install deps at workspace root (monorepo hoisting)
COPY app/package.json ./
RUN npm install
# Move source into subdirectory, node_modules stays at root
COPY app/ ./app/
# Symlink so app/ can resolve root node_modules
RUN ln -s /workspace/node_modules /workspace/app/node_modules

WORKDIR /workspace/app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npx next build

RUN echo "=== Builder ===" && \
    find .next/node_modules -type l -exec sh -c 'echo "  {} -> $(readlink {})"' \;

# --- Runtime: .next moves from /workspace/app/.next to /app/.next ---
FROM node:22-alpine AS runtime
WORKDIR /app
COPY --from=builder /workspace/node_modules ./node_modules
COPY --from=builder /workspace/app/.next ./.next
COPY --from=builder /workspace/app/package.json ./

RUN echo "=== Runtime ===" && \
    find .next/node_modules -type l -exec sh -c \
      'if [ ! -e "{}" ]; then echo "  BROKEN: {} -> $(readlink {})"; \
       else echo "  OK: {} -> $(readlink {})"; fi' \;

EXPOSE 3000
CMD ["npx", "next", "start"]
