# Repro: vercel/next.js#75174 — `generateSitemaps` + `export const runtime = 'edge'` fails at build

## Run

```bash
npm install
npm run build
```

## Result (Next 15.1.6 and 16.3.1)

```
Collecting page data ...
[Error: Failed to collect configuration for /sitemap/[__metadata_id__]] {
  [cause]: [Error: Edge runtime is not supported with `generateStaticParams`.]
}
> Build error occurred
[Error: Failed to collect page data for /sitemap/[__metadata_id__]] { type: 'Error' }
```

## Matrix

| Setup | Result |
| --- | --- |
| next@14.2.23, `app/sitemap.ts` with `generateSitemaps` + `runtime = 'edge'` | build succeeds, route emitted as `ƒ /sitemap/[__metadata_id__]` (dynamic) |
| next@15.1.6, same code | build fails: `Edge runtime is not supported with generateStaticParams.` |
| next@16.3.1, same code | build fails the same way (plus edge-runtime deprecation warning) |
| next@15.1.6, `runtime = 'edge'` but **no** `generateSitemaps` | build succeeds, `ƒ /sitemap.xml` |

So the regression is specific to combining `generateSitemaps` with the edge runtime: the
metadata route `/sitemap/[__metadata_id__]` is treated as requiring `generateStaticParams`,
which is rejected for edge, leaving no way to serve multiple sitemaps dynamically on edge.
