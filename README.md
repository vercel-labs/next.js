# Repro: vercel/next.js#87314

`app/sitemap.ts` using `generateSitemaps()` collides with `app/sitemap.xml/route.ts`.

## Run

```bash
npm install
npm run dev
curl -i http://localhost:3000/sitemap.xml
```

## Observed (Next.js 16.0.10, Turbopack dev)

- Dev server logs: `⚠ Duplicate page detected. app/sitemap.ts and app/sitemap.xml/route.ts resolve to /sitemap.xml`
- `GET /sitemap.xml` -> **500**, the user's route handler never runs. Dev matcher resolves the URL to the
  metadata route `app/sitemap.xml/[__metadata_id__]/route`, which fails with
  `ENOENT ... .next/dev/server/app/sitemap.xml/[__metadata_id__]/route/app-paths-manifest.json`.
- `GET /sitemap/0.xml` and `/sitemap/1.xml` -> 200 (generateSitemaps entries work fine).

Note: `next build` in 16.0.10 fails with `The "id" argument must be of type string. Received undefined`
even after deleting `app/sitemap.xml/route.ts`, i.e. that build failure is a separate `generateSitemaps` bug.
