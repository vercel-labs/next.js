# Issue 88937 — `router.push()` reuses cached middleware redirect from prefetch

Minimal repro (derived from https://github.com/KumarNitin19/nextjs-prefetch-redirect-bug,
with the reporter's `router.refresh()` workaround removed so the bug is visible).

## Run

```bash
npm install
npx playwright install chromium   # or use an existing chromium
npm run build
npm start                         # http://localhost:3000
node verify.js push               # automated check
node verify.js refresh-push       # workaround: navigates successfully
```

## Manual steps

1. Open `/process` (no `processingComplete` cookie). The sidebar `<Link href="/">` prefetches `/`.
2. Middleware answers the prefetch with `307 -> /process` (even with `x-middleware-cache: no-cache`).
3. Click **Start Process (push only)**: sets `document.cookie = 'processingComplete=true'`, then `router.push('/')`.

## Expected

`router.push('/')` issues a fresh request to `/`, middleware re-evaluates with the new cookie and allows `/`.

## Actual

`router.push('/')` issues **zero** network requests. The router replays the redirect cached during
prefetch and the user stays on `/process`. Reproduces with `next@15.5.9` and `next@16.3.1-canary.26`.
