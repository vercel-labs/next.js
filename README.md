# Repro attempt for vercel/next.js#98038

Intermittent 500 on RSC prefetch (`?_rsc=`) of statically prerendered routes,
allegedly thrown inside `app-page.runtime.prod.js` during `/_tree` segment prefetch (Next.js 16.2.6).

Shape modeled from the report: dynamic `/login` page (force-dynamic) linking 5 statically
prerendered "trust" routes that share a Server Component wrapper containing a client component,
under a root layout with a client `Providers` context.

## Run

```bash
npm install          # pins next@16.2.6
npm run build
npm start            # prod server on :3000
node hammer.mjs      # 4000 concurrent RSC/_tree prefetches, prints status histogram
npx playwright test  # reporter-style canary: no _rsc response >= 400, no console errors on /login
```

## Result (this harness)

Not reproduced. Local prod server: 4000 randomized concurrent prefetches (plain `?_rsc=`,
`Next-Router-Segment-Prefetch: /_tree`, `/__PAGE__`) => only 200/204, zero 5xx; cold-start bursts
(400 parallel requests against a freshly started server, x3) => 400/400 200s; Playwright canary
green over 10 `/login` loads. Same app deployed to Vercel: 800 concurrent prefetches => 800x 200.
`x-nextjs-prerender: 1` confirmed on `/termos` prefetch responses.
