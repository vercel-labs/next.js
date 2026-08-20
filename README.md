# Repro for vercel/next.js#24483 — static export + `trailingSlash: true` query params

Next.js version tested: 16.3.1 (`output: 'export'`, `trailingSlash: true`).

## Run

```bash
npm install
npm run dev            # dev server on :3000
npm run build          # static export to ./out
npx serve out -l 3001  # or: (cd out && python3 -m http.server 3005)
node s3-sim.mjs        # S3-like host on :3006 (drops query on the / redirect)
node test.mjs          # Playwright checks (needs a static server on :3005)
```

## Results

| Check | Result |
| --- | --- |
| `curl -D - 'http://localhost:3000/query-test?foo=bar&baz=123'` (dev) | `308` → `/query-test/?foo=bar&baz=123` (query kept) |
| `python3 -m http.server` on `out/` | `301` → `/query-test/?foo=bar&baz=123` (query kept) |
| `serve out` | `200` directly, query kept |
| Exported `<Link>` markup | `href="/query-test/?foo=bar&baz=123"` (slash before query) |
| Client-side `<Link>` nav + `useSearchParams()` | `{"foo":"bar","baz":"123"}` |
| `alternates.canonical: '/discover?id=12345-qwerty'` | `https://example.com/discover?id=12345-qwerty` (no stray trailing slash) |
| `node s3-sim.mjs` (S3-style redirect) | `301` → `/query-test/` — **query dropped by the host** |

Next.js itself preserves the query string in every trailing-slash redirect and in
generated links. The loss only happens when the static host issues its own
directory redirect without the query string (S3 website endpoints do this).
