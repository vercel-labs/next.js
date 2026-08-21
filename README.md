# Reproduction: vercel/next.js#86664

`generateMetadata()` using runtime data (`connection()`) with `cacheComponents: true` and
`htmlLimitedBots: /.*/` makes `next dev` log a generic invariant instead of the specific
"blocking prerender metadata" error.

## Run

```bash
npm install --legacy-peer-deps
npm run dev
# then: curl http://localhost:3000/
```

## Observed (next dev)

```
Error [InvariantError]: Invariant: Route "/" did not produce a static shell and Next.js was unable to determine a reason. This is a bug in Next.js.
```

`next build` on the same app correctly reports the actionable error
("Next.js encountered uncached or runtime data in `generateMetadata()`"), so only the
dev-mode static-shell diagnostic fails to detect `dynamicMetadata`.

Reproduces on 16.0.5, 16.2.1, 16.3.0 and 16.3.1-canary.26.
