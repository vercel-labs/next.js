# Repro: `next/link` with `href={null}` crashes the page (issue #75439)

Pages Router, `next@canary` (verified with 16.3.1-canary.26).

## Steps
```
npm install
npm run build && npm start   # http://localhost:3000
```
Click the button (sets `href` to `null`), the whole page is replaced with
"Application error: a client-side exception has occurred".

Console (production, minified, no user frames, not catchable by a React error boundary):
```
TypeError: Cannot destructure property 'auth' of 'e' as it is null.
```
Thrown from `formatUrl` (`packages/next/src/shared/lib/router/utils/format-url.ts`) via `next/link`.

## Dev mode
`npm run dev` (Turbopack) shows `Failed prop type: The prop 'href' expects a 'string' or 'object' in '<Link>', but got 'null' instead.`
with a stack containing only Next.js/React dist frames — no `pages/index.jsx` frame.
