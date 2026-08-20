# Reproduction for vercel/next.js#70911

`app/[slug]/page.jsx` uses `dynamic = 'force-static'`, `dynamicParams = true`,
`revalidate = 20` and a `<Suspense>` boundary around a 5s async component.

## Run

```bash
npm install
npx playwright install chromium

# A) without PPR
npm run build && npm start                 # port 3015 is used by the test script default
# in another shell
BASE=http://localhost:3015 N=1 node test.mjs

# B) with PPR (experimental.ppr = true)
npm run build:ppr && npm run start:ppr
BASE=http://localhost:3015 N=2 node test.mjs
```

(`next start -p 3015`, or set `BASE` accordingly.)

`test.mjs` clicks a `<Link prefetch={false}>` to a slug that was never requested
before, then reloads the same URL twice, and logs when the static shell appears,
whether the Suspense fallback was shown, and the `x-nextjs-cache` /
`Cache-Control` response headers.

## Observed (Next 15.6.0-canary.61)

A) without PPR — client-side navigation to an unvisited slug blocks for ~5.4s,
no Suspense fallback is ever shown (no streaming). Response is ISR-cached
(`x-nextjs-cache: MISS` then `HIT`, `Cache-Control: s-maxage=20, ...`), so later
reloads are instant.

B) with PPR — streaming works (shell in ~160ms, fallback shown), but the render
is never stored in the ISR cache: every reload streams again and takes ~5.4s,
and the response header is always
`Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`.

A) also reproduces on `next@16.3.1-canary.25` (client nav blocks ~5.4s, no
fallback). On Next 16, B) cannot be expressed as written: `experimental.ppr` was
merged into `cacheComponents`, and `cacheComponents` rejects the `dynamic` /
`dynamicParams` / `revalidate` segment configs used here.
