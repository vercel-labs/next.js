FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install --no-audit --fund=false
COPY . .
RUN npx next build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
# NOTE: HOSTNAME is intentionally NOT set here. Docker sets HOSTNAME in the
# container environment, and .next/standalone/server.js uses it as the bind
# address (`process.env.HOSTNAME || '0.0.0.0'`).
CMD ["node", "server.js"]
