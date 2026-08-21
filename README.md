# Reproduction: `/` is also served at `/index` on Vercel (next.js#87275)

Minimal Next.js 16.0.10 App Router app with a single `app/page.tsx`.

## Local (expected)
```
npm install
npm run build && npm start
curl -o /dev/null -w "%{http_code}\n" http://localhost:3000/       # 200
curl -o /dev/null -w "%{http_code}\n" http://localhost:3000/index  # 404
```

## Deployed to Vercel (bug)
`/index` returns 200 with the home page instead of 404, because the Vercel Next.js
build adapter emits a route that rewrites `/index` -> `/` (response header
`x-matched-path: /`).

## Observed
Deployed (Vercel, Next 16.0.10, App Router):
- `GET /` -> 200, `x-matched-path: /`
- `GET /index` -> 200, `x-matched-path: /` (serves the home page; expected 404)
- `GET /about` -> 404, `x-matched-path: /404`

Local `next build && next start`: `/` -> 200, `/index` -> 404.
`.next/routes-manifest.json` contains no `/index` rule, so the mapping is added
outside Next.js core (Vercel build output routes).
