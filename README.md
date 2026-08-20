# Repro: vercel/next.js#62135

Root `app/loading.js` is not used as the loading UI when navigating from a child
route to a grandchild route.

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # or: npm run build && npm start
node check.mjs         # in another terminal
```

## Expected vs actual

`check.mjs` polls for `#root-loading` during three client navigations:

```
root-to-child:        root loading shown = true
root-to-grandchild:   root loading shown = true
child-to-grandchild:  root loading shown = false   <-- bug
```

During `/child` -> `/child/grandchild` the stale `/child` content stays on
screen for the full 2s server delay and the root `loading.js` boundary is never
shown. Reproduced with next@16.3.1-canary.25 in both `next dev` and
`next build && next start`.
