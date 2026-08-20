# Repro: next.js#60956 — Next.js behind a reverse proxy with `basePath`

The reporter's repository (`zZHorizonZz/nextjs-routing`) is gone ("Repository not found"),
so this is a minimal replacement: an App Router app with `basePath: '/test'` plus a tiny
dependency-free Node reverse proxy (`rp.js`) that emulates the three IIS/nginx rewrite
setups described in the issue.

## Run

```bash
npm install
npm run build && npm start          # Next.js on :3000, basePath /test

node rp.js strip                    # proxy on :8080, /test/* -> :3000/*        (issue case 2)
node rp.js keep    # PORT=8081      # proxy on :8081, /test/* -> :3000/test/*   (issue case 3, correct rule)
node rp.js iis     # PORT=8082      # proxy on :8082, IIS-style `test/(.*)` -> `/test/{R:1}`

curl -si http://localhost:8080/test                          # 404
curl -si http://localhost:8081/test                          # 200
curl -sIL --max-redirs 5 http://localhost:8082/test          # ERR_TOO_MANY_REDIRECTS
```

## Observed (next 16.3.1 and next 14.1.0, `next start`)

| setup | result |
| --- | --- |
| proxy strips `/test`, `basePath: '/test'` | every request 404 (Next never sees the basePath) |
| proxy preserves `/test`, `basePath: '/test'` | 200, assets under `/test/_next/*` load fine |
| IIS-style rule that re-adds the trailing slash | infinite 308 loop: `/test/` -> `/test` -> proxy rewrites to `/test/` -> ... |

Root cause of the reported "too many redirects" is Next's default
`trailingSlash: false` normalization (308 `/test/` -> `/test`) fighting a rewrite rule
that always appends the slash, not a proxy-specific bug.
