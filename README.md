# Repro: vercel/next.js#96933

`cacheComponents: true` + dynamic segments + `generateStaticParams` returning one concrete set +
`generateMetadata` awaiting `params` → `next build` fails on fallback shells with
"Next.js encountered uncached or runtime data in `generateMetadata()`", even though the build phase
set `_allowEmptyStaticShell: true` for those shells.

## Run

```bash
npm install
npm run build   # fails on Next 16.3.0
```

## Results

- next@16.3.0 / 16.3.1-canary: build fails on `/[a]/[b]` (and `/x/[b]`).
- next@16.2.12: build succeeds, all shells emitted as `◐ (Partial Prerender)`.
- Instrumenting `throwIfDisallowedDynamic` in the compiled turbo runtime shows
  `prelude=0 allowEmpty=true hasAllowedDynamic=false hasDynamicMetadata=true`, i.e. the metadata
  mistake-detection check runs before the `allowEmptyStaticShell` bypass.
