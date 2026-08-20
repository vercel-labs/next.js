# Repro attempt for vercel/next.js#59407 — "(PPR) searchParams not work after reloading"

Modernized version of the reporter's repro (original used next@14.0.5-canary.1 with
`experimental.ppr: true`; its Vercel deployment is now SSO-protected and old canaries are
rejected by Vercel builds as vulnerable).

- next@16.3.1-canary.25, `cacheComponents: true` (PPR successor in Next 16)
- `/` reads `searchParams` inside `<Suspense>` + `generateMetadata`
- `/action` re-renders via a server action calling `revalidatePath`
- `/product/[handle]` checks the "params swallow searchParams" comment variant

## Run

```bash
npm install
npm run build && npm start
# then: open /test, click the link to /?id=1, reload
```

Deployed on Vercel and checked with Playwright (link click, reload, cache HIT/PRERENDER,
server action, dynamic param + searchParams): `searchParams` resolved correctly in every case,
i.e. the reported behavior no longer reproduces on this version.
