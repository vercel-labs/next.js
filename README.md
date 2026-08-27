# Repro: document-global `#__next-page-redirect` check turns Link clicks into MPA navigations

Issue: https://github.com/vercel/next.js/issues/97989 · Next `16.4.0-canary.8`,
`cacheComponents: true`, `next build && next start`.

```bash
npm install
npm run build
npm start &            # http://localhost:3100 if PORT=3100, default 3000
BASE=http://localhost:3000 node repro.mjs   # main repro + control
BASE=http://localhost:3000 node slow.mjs    # natural streamed-redirect timeline
```

## Routes

- `/gated` – request-time gate behind `<Suspense>` calling `redirect('/target')`
  after the shell streamed, so Next injects
  `<meta id="__next-page-redirect" http-equiv="refresh" content="1;url=/target">`
  into the streamed HTML (`curl -s localhost:3000/gated | grep __next-page-redirect`).
- `/slow-gated` – same, but the gate resolves ~1.5s after hydration.
- `/target`, `/other`, `/` – plain routes with `<Link>`s.
- `app/sentinel.tsx` – sets `window.__sentinel`, which only survives soft navigations.

## Observed (`repro.mjs`)

1. Marker present anywhere in the document (here inside a `hidden` container,
   standing in for a hidden `<Activity>` subtree): clicking `<Link href="/other">`
   on the active `/target` route issues a top-level document request
   `GET /other` and `window.__sentinel` is recreated → full page navigation.
2. Control, no marker: same click issues **no** navigation request, the sentinel
   survives, and both `<h1>`s (`Other`, `Target`) stay in the DOM, i.e. the
   previous route is retained in a hidden Activity.

Cause is the document-wide lookup in `navigate-reducer`:
`if (document.getElementById('__next-page-redirect')) return completeHardNavigation(...)`.

## Note on the origin of a stale marker (`slow.mjs`)

On `16.4.0-canary.8` the streamed redirect on `/gated` / `/slow-gated` always
ends in a hard navigation to `/target`, so the marker's document is replaced and
no marker survives into a hidden Activity subtree in this reproduction. The
stale marker therefore has to be simulated (as in the original report's README);
only the consequence of a surviving marker is reproduced deterministically here.
