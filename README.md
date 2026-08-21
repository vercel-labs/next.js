# Repro: router.refresh() after notFound() keeps showing the 404 (vercel/next.js#77086)

Mirror of https://github.com/zoeyfyi-sage/nextjs-notFound-refresh-issue with an automated Playwright check.

## Run

```bash
npm install
npx playwright install chromium --with-deps
npx next dev -p 3000 &     # or: npm run build && npx next start -p 3000
BASE=http://localhost:3000 npm run repro
```

## Expected vs actual

`app/page.tsx` calls `notFound()` when a server-side flag is false.

1. Flag `true` -> page renders `Home`.
2. Toggle to `false` + `router.refresh()` -> renders the 404 page (correct).
3. Toggle back to `true` + `router.refresh()` -> server re-renders the page (`rendering home, toggle is true`)
   but the browser stays on the 404 page. A hard reload shows `Home`, proving the server output is fine.

Script output on next@16.3.1-canary.26 and next@15.3.0-canary.5:

```
1. initial body: "Home\nToggle true"
2. after toggle->false body: "404\nThis page could not be found.\nToggle false"
3. after toggle->true body: "404\nThis page could not be found.\nToggle true"
RESULT: still 404 after refresh (reproduced)
4. after hard reload body: "Home\nToggle true"
```
