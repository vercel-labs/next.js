# Mirrors the standard Next.js docker guide: build inside the image, run the
# standalone server. NEXT_PUBLIC_* values are frozen at `next build` time.
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
# .env.production sets NEXT_PUBLIC_API_URL=BUILD_TIME_VALUE
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
# docker run -e NEXT_PUBLIC_API_URL=RUNTIME_VALUE -e PRIVATE_API_URL=RUNTIME_VALUE ...
CMD ["node", "server.js"]
