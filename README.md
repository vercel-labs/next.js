# Repro: navigating out of `not-found` errors when a parallel route exists (vercel/next.js#73362)

App structure:

- `app/layout.js` renders both `children` and a `@testRoute` parallel slot
- `app/@testRoute/(.)modal/page.js` intercepting route inside that slot, plus `default.js`
- `app/not-found.js` contains a `<Link href="/">`

## Steps

```bash
npm install
npm run dev            # terminal 1
npm run test:nav       # terminal 2 (Playwright); or do it manually:
```

Manual: open `http://localhost:3000/does-not-exist` (renders the custom not-found page),
then click "Go home".

## Result on next@15.5.23 (and 15.0.4-canary.31 as reported)

The RSC navigation request for `/` returns **500** and the dev server logs:

```
⨯ next/dist/src/server/app-render/walk-tree-with-flight-router-state.tsx (238:50)
⨯ TypeError: Cannot read properties of undefined (reading '0')
    !!flightRouterState[1][parallelRouteKey][0]
```

The FlightRouterState sent from the `/_not-found` tree only contains a `children`
slot, so the lookup of the `testRoute` parallel slot key is `undefined`.

## Not reproducible on next@16.3.1 / 16.3.1-canary.25

Same app on Next 16 navigates from the not-found page to `/` with no server error.
