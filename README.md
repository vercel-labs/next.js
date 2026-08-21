# Repro for vercel/next.js#76547

Execution order of server components differs between `next dev` and `next start`
when the root layout awaits `headers()`.

## Run

```bash
npm install
npm run dev            # request http://localhost:3000
# stop, then:
npm run build && npm run start   # request http://localhost:3000
```

## Observed

dev:
```
page render
button render
layout render localhost:3000
```

prod (`next build && next start`):
```
page render
layout render localhost:3000
button render
```

Removing `await headers()` from `app/layout.tsx` (e.g. replacing it with
`await new Promise(r => setTimeout(r, 0))`) makes production match dev
(`page -> button -> layout`), so reading `headers()` is what changes the
render order.

Reproduced with next@15.2.0-canary.76 (reporter's version) and next@16.3.1-canary.26.
