# Repro attempt: next#70252 — `headers()` + optional catch-all segment under PPR returns empty page (Vercel)

Modernized version of the reporter's repro (https://github.com/hugohammarstrom/next-ppr-headers-repro),
which no longer builds on current canary (`experimental.ppr` was merged into `cacheComponents`,
`revalidate`/`dynamicParams` are rejected with `cacheComponents`, and `headers()` must be awaited).

Structure: proxy/middleware rewrites `/<path>` to `/<host>/<path>` into
`app/[domain]/[[...slug]]/page.tsx`, which awaits `headers()`; the dynamic hole sits inside a
`<Suspense>` boundary in the root layout so the PPR shell can be prerendered.

## Run

```bash
npm install
npm run build && npm start
curl -s localhost:3000/ | grep rendered   # root path (empty optional catch-all)
curl -s localhost:3000/foo | grep rendered
```

The original report only failed on Vercel deployments, so also deploy this directory
(`vercel deploy --prod`) and request `/`, `/foo`, `/a/b`.

## Result on next@16.3.1-canary.25 (Vercel deployment + local prod)

`/` returns HTTP 200 with the fully rendered dynamic content (`<h1 id="ok">rendered</h1>`,
`params: { domain }`, resolved `host` header) — same as `/foo` and `/a/b`.
No empty page, no flicker, and no `invariant: cache entry required but not generated` /
`Invariant: postponed state should not be provided when fallback params are provided`
in the function logs. Old canaries such as `15.0.0-canary.159` cannot be deployed to Vercel
anymore ("Vulnerable version of Next.js detected"), so the original version could not be re-tested.
