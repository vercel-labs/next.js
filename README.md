# Repro: pages-router scroll restoration lost on back navigation (vercel/next.js#68746)

Minimal reproduction of https://github.com/vercel/next.js/issues/68746

- `/` and `/page2` are Pages Router routes.
- `/page3` and `/page4` are App Router routes.
- Each page is 8000px tall with a `position: fixed` link, so clicking never changes scroll math.

## Run

```bash
npm install
npm run build && npm start        # or: npm run dev
npx playwright install chromium
node scroll-test.js               # automated check against http://localhost:3000
```

Manual: open `/`, scroll to ~2000px, click the fixed link to `/page2`, press Back.

## Result (next@14.2.5, react@18.2.0)

```
{"label":"pages-router","route":"/","before":2000,"afterBack":0,"restored":false}
{"label":"app-router","route":"/page3","before":2000,"afterBack":2000,"restored":true}
```

Pages Router lands at scrollY 0; App Router restores 2000. Same in `next dev` and `next start`.

## Version matrix observed with this repro

| next | react (client) | pages router restored |
| --- | --- | --- |
| 14.2.5 | 18.2.0 | no |
| 14.2.5 | 18.3.1 | no |
| 14.2.5 | 19.0.0 | yes |
| 15.5.23 | 18.3.1 | no |
| 16.3.1-canary.25 | 18.3.1 | yes |
