# Repro: `redirect()` in a server component flashes blank UI (vercel/next.js#57455)

Client-side `<Link>` navigation to a route whose server component calls
`redirect()` paints the destination route's layout with **empty children**
before the redirect target renders.

## Run

```bash
npm install
npm run build && npm start          # http://localhost:3020
# in another shell (needs playwright installed):
node probe.mjs http://localhost:3020
```

Then click "Go to /source" manually, or let `probe.mjs` record one animation
frame timeline of URL + visible content.

## Observed

```
frame timeline (ms, pathname, visible text of #content):
    0  /           "Home page Go to /source ..."
   xx  /source     ""            <-- blank flash (layout only)
   xx  /target     "Target page"
```

Expected: no intermediate blank paint, matching the server-action `redirect()`
behaviour which does not flash.
