# Reproduction attempt: next.js#66660

`basePath: '/admin'`, App Router, `<Link href="/">` clicked after a hard load of `/admin/about`.
Reported behavior: navigation lands on `/admin/admin`.

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # terminal 1
npm run verify         # terminal 2 (or: node verify.mjs http://localhost:3000)
```

Also tested with `npm run build && npm run start`, and with `next@canary`.

## Result observed here

`next@14.2.3` (the version in the issue) and `next@16.3.1-canary.25`, `next dev` and
`next build && next start`: the hover href is `/admin` and the click navigates to
`/admin` — the double `basePath` was not reproduced.

Additional variants that also did NOT reproduce:
`redirects()` in config (client router filter populated), `middleware.js`,
`trailingSlash: true`, distinct root layouts (MPA navigation), and hybrid
`app/` + `pages/` projects (pages -> app and app -> pages navigation).
