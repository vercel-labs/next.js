# Repro: `Fetch failed loading: GET ".../?_rsc=..."` in Chrome DevTools console (next dev)

Upstream issue: https://github.com/vercel/next.js/issues/65387
(The reporter's repo `spacecat/nextjs-04` no longer exists, so this is a minimal re-creation.)

Next.js aborts in-flight RSC prefetch/navigation requests (`?_rsc=...`) during App Router
client navigation. Chrome DevTools, with **Log XMLHttpRequests** enabled in Console
settings, prints one error-looking line per aborted request:

```
Fetch failed loading: GET "http://localhost:3000/dashboard/blog?_rsc=aou09".
```

The app itself works; only the console output looks like an error.

## Manual steps
1. `npm install`
2. `npm run dev`
3. In Chrome DevTools > Console settings, enable "Log XMLHttpRequests"
4. Open http://localhost:3000/dashboard
5. Click "To Blog" / "To Dashboard" repeatedly, pause, repeat

## Automated check (no DevTools UI needed)
`npm run repro` drives the same navigation with Playwright and listens to the raw CDP
`Network.loadingFailed` events — the exact events DevTools turns into those console lines.

```
npm install
npx playwright install chromium
npm run dev            # in one terminal
npm run repro          # in another
```

Output on next@14.2.3 and next@canary (16.3.1-canary.25):

```
[devtools-console] Fetch failed loading: GET "http://localhost:3000/dashboard/blog?_rsc=aou09". (canceled=true, errorText=net::ERR_ABORTED)
RESULT: reproduced
```

14.2.3 produced 1 aborted RSC fetch over ~96 navigations (matching the reporter's "it's
random"); next@canary produced ~90.
