# Repro: app router pages ignored when `pageExtensions` is set (vercel/next.js#51478)

Reproduced with `next@16.3.1-canary.25` (dependency pinned to `canary`).

## Setup
- `next.config.js`: `pageExtensions: ['custom.tsx','custom.ts','custom.jsx','custom.js']`
- `pages/mypage.custom.jsx` -> `/mypage`
- `app/myotherpage/page.jsx` -> `/myotherpage` (default `page.jsx` name)
- `app/withcustomext/page.custom.jsx` -> `/withcustomext`

## Run
```bash
npm install
npm run dev   # then curl the three routes
npm run build # route list
```

## Observed
- `/mypage` -> 200
- `/myotherpage` -> **404** (app router file must also carry the custom extension)
- `/withcustomext` -> 200
- `next build` route list only contains `/_not-found`, `/withcustomext` (app) and `/mypage` (pages);
  `app/myotherpage/page.jsx` is never picked up.

`pageExtensions.map is not a function` (single-entry config) no longer reproduces on current canary.
