# Repro: vercel/next.js#80100 — unencoded `&` in static file path 404s in production (`next start`)

Static file: `public/About STAR & HPI (09-2024).pdf`

## Run

```bash
npm install
npm run build
npm run start   # http://localhost:3001
```

Open `/` and click "navigate to static file (PDF)" (href contains a literal `&`).

## Observed (Next 16.3.1 and 15.4.0-canary.62)

| request path | `next dev` | `next start` |
| --- | --- | --- |
| `/About%20STAR%20&%20HPI%20(09-2024).pdf` | 200 `application/pdf` | **404 text/html** |
| `/About%20STAR%20%26%20HPI%20(09-2024).pdf` | 200 `application/pdf` | 200 `application/pdf` |

Deployed on Vercel both variants return 200 (CDN serves the asset), so the
inconsistency is between `next dev` and the self-hosted production server.

```bash
curl -s -o /dev/null -w "%{http_code} %{content_type}\n" --path-as-is \
  "http://localhost:3001/About%20STAR%20&%20HPI%20(09-2024).pdf"
```
