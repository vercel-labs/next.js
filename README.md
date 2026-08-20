# Repro: `experimental.scrollRestoration` makes the iOS swipe-back snapshot blank (#62133)

pages router, `experimental.scrollRestoration: true`.

```
npm install
npm run dev   # or: npm run build && npm start
```

1. Open on a physical iPhone (Safari or Chrome).
2. Scroll to the bottom of `/` and tap **GO COLL** (client-side navigation to `/other`).
3. Swipe back from the left screen edge.
4. The live back-navigation snapshot of `/` is blank.

The page prints `history.scrollRestoration`: it is `manual` with the flag on and
`auto` with the flag removed from `next.config.js`. WebKit skips the page
snapshot for the swipe-back gesture when `history.scrollRestoration === 'manual'`.
Verified still `manual` on next@16.3.1-canary.25 and next@14.1.0.
