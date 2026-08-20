# Repro: duplicate Set-Cookie headers (middleware + server action) — vercel/next.js#69785

Next.js 16.3.1. Middleware sets `middleware-repro`; a server action sets the same
cookie name. The server-action POST response contains two `Set-Cookie` headers
for `middleware-repro` instead of only the last one.

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # or: npm run build && npm start
node check.mjs         # BASE=http://localhost:3001 node check.mjs for prod
```

## Observed (dev and next start)

```
Set-Cookie: middleware-repro=from-middleware; Path=/
Set-Cookie: middleware-repro=from-action; Path=/
Set-Cookie: action-repro=from-action-2; Path=/
```

Expected: only `middleware-repro=from-action` and `action-repro=from-action-2`.

Note: `x-middleware-set-cookie` no longer leaks to the client in 16.3.1.
