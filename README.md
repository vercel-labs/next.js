# Reproduction for vercel/next.js#71187

`redirect()` inside a `layout.tsx` that targets a route **owned by that same layout** makes the
App Router loop forever after a client-side `next/link` navigation.

## Run

```bash
npm install
npm run dev   # or: npm run build && npm start
```

Open http://localhost:3000 and click the `[BUG] next/link to /ok` link.

## Expected

Same as clicking the plain `<a href="/ok">` link: one redirect, `/ok/child` renders once.

## Actual

The URL becomes `/ok/child` but the router keeps re-fetching
`/ok/child?_rsc=...` with a router state tree whose leaf stays marked `"refetch"`,
at roughly 35 requests per second, indefinitely (visible in the dev server log and in devtools).
On Next 14.2.15 the same loop also floods the console with
`Warning: Maximum update depth exceeded ... at HandleRedirect`.

Control case: `next/link` to `/a`, whose layout redirects to `/b` (outside that layout),
does not loop. Full-page navigation never loops either.

Reproduced on next@14.2.15, next@15.5.4 and next@16.3.1-canary.25.
