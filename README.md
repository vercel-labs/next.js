# Reproduction: `next/dynamic` chunk load failure takes down the whole page

Issue: https://github.com/vercel/next.js/issues/63918

A single client component is loaded with `next/dynamic` (`ssr: false`). When the network request for
that chunk fails, the failure is not contained to the dynamic component: the entire page (including
statically rendered content that was already visible) is replaced by Next.js' client-side error page.

## Run

```bash
npm install
npm run build
npm run verify   # starts `next start`, aborts only the <Foo /> chunk request in Chromium, prints the result
```

Manual variant:

```bash
npm run build && npm start
# open http://localhost:3000, block the chunk containing <Foo /> in the DevTools Network tab, reload
```

## Observed

Next.js `16.3.1-canary.25` (Turbopack production build, no error boundary):

```
[blocked] http://localhost:3000/_next/static/chunks/0-9x_f5fa1yav.js
[console.error] Failed to load resource: net::ERR_FAILED
[pageerror] Failed to load chunk /_next/static/chunks/0-9x_f5fa1yav.js from module 72966

visible page text:
"This page couldn’t load

Reload to try again, or go back.

Reload
Back"
```

The `<p>Static content that should survive a failed chunk load.</p>` markup from `app/page.tsx`
is gone from the DOM.

Same build with `next build --webpack`:

```
ChunkLoadError: Loading chunk 506 failed. (error: /_next/static/chunks/506.ad31a452cd5ce693.js)
```

With `app/error.tsx` present (see `app/error.tsx.example`) the error is caught, but the whole route
segment — not just `<Foo />` — is swapped for the error UI.

Original report on `next@14.2.0-canary.50` (webpack, no error boundary) renders:
`Application error: a client-side exception has occurred`.

## Expected

A failed `next/dynamic` chunk request should be recoverable/containable (e.g. surfaced to the
nearest Suspense/error boundary around the dynamic component, or retried) instead of tearing down
the whole page.
