# Repro: next.js#65359 — client component state lost on browser Back (App Router)

Minimal reproduction of https://github.com/vercel/next.js/issues/65359
(the reporter's CodeSandbox devbox is not fetchable, so this mirrors the described steps).

## Run

```bash
npm install
npm run dev        # http://localhost:3000
# or: npm run build && npm start   # http://localhost:3001
node test.mjs http://localhost:3000 dev   # automated Playwright check
```

## Steps

1. Open `/` — the client component `app/data-view.js` renders 10 items from server data.
2. Click **Load more** — a server action appends 10 more items into `useState`; "rendered items: 20".
3. Click **Go to 10** (`<Link href="/blog/10">`).
4. Press the browser Back button.

## Expected

Home is restored with the 20 items the user had loaded (bfcache-like behavior).

## Actual

Home renders "rendered items: 10": the client component remounts and all accumulated
state is discarded, even though no RSC/network request is made on the back navigation
(the entry is served from the client router cache).

Observed with next@15.6.0-canary.42, react@19, in both `next dev` and `next build && next start`.
