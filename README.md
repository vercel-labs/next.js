# Reproduction attempt for vercel/next.js#97847

Turbopack dev server reported to livelock (600–777% CPU, never serves a request) in a
pnpm-workspace monorepo on **darwin-arm64** with `next dev --turbo`.

Shape: pnpm workspace + Turborepo, 5 workspace packages (`utils`, `config`, `icons`,
`i18n`, `ui`) with a real inter-package dependency graph, `apps/web` App Router with
i18n-style dynamic routes and `transpilePackages`.

## Run

```bash
pnpm install
cd apps/web && ./node_modules/.bin/next dev --turbo -p 3000
# in another shell
curl -s -o /dev/null -w "HTTP %{http_code} in %{time_total}s\n" --max-time 30 http://localhost:3000/
ps -eo pid,pcpu,rss,comm | grep next-server
```

## Status

- linux-x64, Node 24, `next@16.2.11` (the reported affected version): **no livelock**.
  `✓ Ready in 321ms`, idle 1.7–3.2% CPU / 185 MB RSS, `GET / 200 in 2.2s`.
- The reporter states Linux is immune; darwin-arm64 hardware was not available to verify.
