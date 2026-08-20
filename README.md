# Repro: next.js#54665 — `sitemap.ts` ignored when `pageExtensions` is customized

Next.js canary 16.3.1-canary.25 (Turbopack).

`next.config.js` sets `pageExtensions: ['next.tsx','next.ts','next.jsx','next.js']`.
`app/sitemap.ts` exists.

## Run

```bash
npm install
npm run dev
curl -i http://localhost:3000/sitemap.xml   # => 404
npm run build                                # => route list has no /sitemap.xml
```

## Observed

- `app/sitemap.ts` -> `GET /sitemap.xml 404`
- renaming to `app/sitemap.next.ts` (matching pageExtensions) -> still 404
- adding `'ts'` back to `pageExtensions` -> 200 with valid XML

Metadata convention files are filtered by user `pageExtensions` instead of their own
fixed extension set, and the `<name>.<pageExtension>` form is not recognized either.
