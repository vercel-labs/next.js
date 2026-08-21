# Reproduction for vercel/next.js#83509

Algolia InstantSearch pagination stops updating the URL after a browser back
navigation (Pages Router, dynamic route `[...product-path]`).

## Run

```bash
npm install
npx playwright install chromium
npm run dev        # in one terminal
npm test           # in another terminal (or: BASE_URL=http://localhost:3001 npm test against `npm run build && npm start`)
```

Manual: open http://localhost:3000/shoes/red?tab=product, click page 2, page 3,
press browser back, then immediately click page 3 again.

## What happens

* `back then paginate quickly (< 400ms writeDelay)` **fails**: UI + data show
  page 3, URL stays `?page=2&tab=product`.
* `back then paginate slowly (> 400ms)` passes.
* `control: same race without next/router (plain history router)` (page
  `/plain`, no `next/router` integration at all) **fails the same way**.

## Cause

`instantsearch.js` `BrowserHistory` sets `inPopState = true` on `popstate` and
clears any pending write timer. `shouldWrite()` returns `false` while
`inPopState` is `true`, and the flag is only reset when a write timer actually
fires (`writeDelay`, default 400ms). A refinement performed inside that window
replaces the pending timer, so the first `pushState`/`router.push` after a back
navigation is swallowed and the URL desyncs from the UI. No Next.js API is
involved, as the `/plain` control shows.

Fake search client is used, so no Algolia credentials/network are needed.
Versions: next 14.2.30, react 18.2.0, react-instantsearch(-router-nextjs) 7.16.2.
