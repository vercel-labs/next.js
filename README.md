# Repro: vercel/next.js#65447

`next build` fails with `TypeError: Cannot read properties of undefined (reading 'clientModules')`
while prerendering `/_not-found` when `pageExtensions` is set and the App Router special files
use those extensions (`layout.page.tsx`, `page.page.tsx`, `not-found.page.tsx`, ...).

## Run

```bash
npm install
npm run build
```

## Results

| next | result |
| --- | --- |
| 14.1.4 | build succeeds |
| 14.2.3 | FAILS: `Export encountered errors on following paths: /_not-found/page: /_not-found` |
| 14.2.35 | FAILS (same) |
| 15.5.23 | build succeeds (custom not-found used) |
| 16.3.1 (turbopack and webpack) | build succeeds |

Change the `next` version in `package.json` to switch.
