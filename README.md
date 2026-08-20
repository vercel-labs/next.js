# Repro: Module not found: Can't resolve '#async_hooks' (webpack) — vercel/next.js#58052

Minimal App Router app importing `p-limit@5.0.0`, which uses a Node.js
`imports` subpath (`#async_hooks`) in its package.json.

## Steps

```bash
npm install
npx next build --webpack   # fails: Module not found: Can't resolve '#async_hooks'
npx next dev --webpack     # request / -> 500 with the same error
npx next build             # Turbopack: succeeds
```

Observed on next@16.3.1 and next@16.3.1-canary.25.
