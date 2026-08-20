# Reproduction — vercel/next.js#73803

Intercepting/parallel routes need a `next dev` restart after the intercepted segment is renamed.

```bash
npm install
npm run verify   # exits 0 when the bug reproduces
```

`verify.mjs` boots `next dev`, clicks a card (modal appears via `@modal/(..)audit`), renames
`audit` -> `auditt` (both folders + the `<Link href>`) while dev is running, clicks again
(full page instead of the modal = bug), then restarts dev (modal is back).

Observed: reproduces with next@15.1.1 and next@15.5.4 (Turbopack and webpack).
Not reproducible with next@16.0.0 / next@16.3.1-canary.25 (both bundlers).
