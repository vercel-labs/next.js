# Repro harness for vercel/next.js#94802 — intermittent 404s on App Router routes (Next 16.2.9)

Minimal App Router app (static page, static `/about`, dynamic Route Handler `/api/health`)
plus a stress script that requests all three routes in a loop and logs any non-200 response.

## Run

```bash
npm install
npm run build
npm start &            # production server on :3000 (default)
./stress.sh            # edit PORT in the script if needed; logs non-200s to ./stress.log
```

For dev mode: `npm run dev` instead of build/start.

## Result in this sandbox

Next.js 16.2.9, Node 24.17.0 and Node 20.20.0, ~15k requests per server over ~6 minutes
in both `next start` and `next dev`: **zero** non-200 responses. Not reproduced.

Observed side note: under continuous load the `next dev` server RSS grew ~80 MB/min
(2.48 GB -> 2.64 GB in 3 min), while `next start` stayed flat (~310 MB).
