# Repro: duplicate `S:N` segment id on the Cache Components resume path (vercel/next.js#97310)

```bash
npm install
npm run build
npm start
node check.mjs http://localhost:3000/on-demand-1   # duplicate ids -> exit 1
node check.mjs http://localhost:3000/seeded        # clean (build-time resolved id)
```

`app/[id]/page.tsx` mixes three Suspense-wrapped `'use cache'` widgets that are
outlined into hidden segments of the stored shell with one `<Suspense>`-wrapped
dynamic child that awaits `params` and fans out into nested `'use cache'` calls.

For an id that is **not** in `generateStaticParams`, the served HTML contains the
same `S:N` id twice: once as the shell boundary reveal `$RC("B:N","S:N")` and once
as a resume segment `$RS("S:N","P:N")`. In a browser this throws
`HierarchyRequestError: Failed to execute 'insertBefore' on 'Node'`.

Reproduces on next@16.2.11 (react 19.2.4). Verified fixed on next@16.3.0 and
next@16.3.1-canary.19 with the same app.
