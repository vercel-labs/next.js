# Repro harness for vercel/next.js#61923

`export const revalidate = x` reportedly works locally but never revalidates when deployed to Vercel.

- `app/page.tsx` — static App Router page with `export const revalidate = 10`, prints the render timestamp.
- `app/unstable-cache/page.tsx` — `force-dynamic` page whose data comes from `unstable_cache(..., { revalidate: 10 })` (the variant reported in the issue comments).

## Run

```bash
npm install
npm run build && npm start
./poll.sh http://localhost:3000 12
# deploy the same directory to Vercel and poll the deployment URL
./poll.sh https://<deployment>.vercel.app 12
./poll.sh https://<deployment>.vercel.app/unstable-cache 14
```

The timestamp must change roughly every 10s once traffic keeps arriving (stale-while-revalidate:
the first request after expiry serves the stale value and triggers a background regeneration).

## Result observed (2026-08-20)

Verified with `next@canary` (16.3.1-canary.25) and with the reported `next@14.1.0`:

- local `next build && next start`: timestamp updates every ~10s.
- Vercel deployment (`next@canary`): timestamp updates every ~10-15s, `x-vercel-cache` alternates `HIT`/`STALE`.
- Vercel deployment (`next@14.1.0`): same, both `/` and `/unstable-cache` revalidate every ~10s.

So segment-level `revalidate` and `unstable_cache` revalidation are not reproducible as reported.
Note the reporter's app used `revalidate = 21600` (6h); low-traffic pages only regenerate on the
first request after expiry, so a route must be requested at least twice after expiry to see fresh data.
