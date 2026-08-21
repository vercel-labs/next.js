# Repro: `alternates.media` is dropped from generated sitemap XML (issue #85103)

Next.js `16.3.1-canary.26`.

## Run

```bash
npm install
npm run dev
curl http://localhost:3000/pathname/sitemap/0.xml   # generateSitemaps case
curl http://localhost:3000/sitemap.xml              # single sitemap case
```

`npm run build && npm start` shows the same output.

## Observed

`alternates.media` entries never appear as `<xhtml:link rel="alternate" media="..." />`;
only `alternates.languages` is serialized. The `xmlns:xhtml` namespace is still added
when only `media` is present, producing an empty declaration.

`resolveSitemap()` in `packages/next/src/build/webpack/loaders/metadata/resolve-route-data.ts`
reads only `item.alternates?.languages`, and the `MetadataRoute.Sitemap` type only declares
`alternates.languages`.
