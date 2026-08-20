# Reproduction: `next build` breaks a running `next dev` server (vercel/next.js#61228)

The reporter did not provide code ("There is no code -- read on..."), so this is a
minimal App Router app that automates their steps.

## Run

```bash
npm install
./repro.sh          # PORT=3000 by default, logs in ./logs
```

## What it does

1. starts `next dev` and verifies `/` and `/about` return 200
2. runs `next build` in parallel (default `distDir: .next`, shared with dev)
3. keeps refreshing the pages

## Observed (next 15.5.23 and 14.1.0, webpack dev server)

Every request turns into HTTP 500 and stays broken until `next dev` is restarted:

```
 ⨯ Error: Cannot find module './833.js'
Require stack:
- <app>/.next/server/webpack-runtime.js
- <app>/.next/server/pages/_document.js
...
```

`next build` also fails in the other direction on 14.1.0
(`Failed to collect page data for /_not-found` / `PageNotFoundError`), because both
processes write the same `.next` directory.

## Version matrix (same script, same app)

| next | result |
| --- | --- |
| 14.1.0 (reported) | REPRODUCED - `Cannot find module './22.js'`, persistent 500; `next build` also fails |
| 15.5.23 (latest 15.x) | REPRODUCED - `Cannot find module './833.js'`, persistent 500 |
| 16.3.1 (latest) | OK - dev output moved to `.next/dev`, dev keeps serving 200 during and after the build |

Workaround on 14.x/15.x: give dev its own directory, e.g.
`distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next'`.
