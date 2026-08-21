# Repro: vercel/next.js#77245

Client-side navigation via `<Link>` with a query string updates the URL but does not render
the target page, in a production build, when an unrendered parallel route slot has a
`loading.tsx`.

Mirror of https://github.com/jatwood/nextjs15-repro with `next` pinned to `15.5.7`
(the original pins `next: canary`, which no longer reproduces).

## Steps

```bash
npm install
npm run build
npm start
# open http://localhost:3000/app/page1 and click "Click me to go to page 2"
```

Expected: `/app/page2?foo=bar` renders `<h1>Page 2</h1>`.
Actual (15.x): the URL becomes `/app/page2?foo=bar` but `<h1>Page 1</h1>` stays on screen.

Reproduces: 15.3.0-canary.12 (as reported), 15.5.7.
Fixed: 16.3.1 (renders `Page 2`). 16.0.0 cannot build this app -- it requires a
`default.js` for the `@parallel` slot.

Required conditions (from the reporter, confirmed): unrendered parallel route + `loading.tsx`
in that slot + query string on the link + no explicit `prefetch` prop.
