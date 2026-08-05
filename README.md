# Reproduction: next.js#96705 — Turbopack dev SSR stops applying server updates after a browser connects

Based on the reporter's repo (https://github.com/yuanzhixiang/next-turbopack-server-hmr-repro,
commit 906234c) plus an automated Playwright A/B driver. Contrary to that repo's README, this
setup **does** reproduce the bug on Next.js 16.2.2 in a Linux sandbox.

## Run

```bash
npm install --legacy-peer-deps
npm i -D playwright && npx playwright install chromium
npx next dev --port 3005        # in one shell
node repro.mjs                  # in another shell
```

## Observed on next@16.2.2 (default: server fast refresh on)

```
no browser   edit a1 -> ssr=PROBE-a1
no browser   edit a2 -> ssr=PROBE-a2
browser connected, sees: PROBE-a2
with browser edit b1 -> ssr=PROBE-b1 client=PROBE-b1
with browser edit b2 -> ssr=PROBE-b1 client=PROBE-b1   <-- frozen
with browser edit b3 -> ssr=PROBE-b1 client=PROBE-b1   <-- frozen
```

Turbopack still compiles: `.next/dev/server/chunks/ssr/[root-of-the-server]__*.js` contains the
latest string while the dev server keeps rendering the old one. Restarting the dev server recovers.

## Not reproducible with

* `npx next dev --port 3006 --no-server-fast-refresh` on 16.2.2 — every edit applies (b1/b2/b3).
* `next@16.3.0` (default settings) — every edit applies (b1/b2/b3). Fixed upstream.
