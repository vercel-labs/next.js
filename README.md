# Reproduction for vercel/next.js#67951

Pages Router: stale search parameters when `as` of `next/link` contains a fragment.

When the `as` value differs from the current URL **only by the fragment**, the Pages
Router takes the `onlyAHashChange()` shortcut in
`next/dist/shared/lib/router/router.js` and returns early, so the `query` carried by
`href` is never applied. Clicking a second link with the same `as` (`/#section`) but a
different `href` query is a complete no-op: `router.query` and the address bar keep the
previous value.

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # or: npm run build && npm start
npm run repro          # Playwright script, prints router state after each click
```

Manual steps: open `http://localhost:3000/?q=0`, click `q=1 (as="/#section")`, then
`q=2 (as="/#section")`.

## Observed (next 16.3.1 and 14.2.5, dev and next start)

```
[with-anchor-in-as]    start: router.query.q=0 asPath=/?q=0
  click #bug-1 -> router.query.q=1 asPath=/#section
  click #bug-2 -> router.query.q=1 asPath=/#section   <-- stale, expected q=2

[without-anchor-in-as] start: router.query.q=0 asPath=/?q=0
  click #ok-1  -> router.query.q=1 asPath=/?q=1
  click #ok-2  -> router.query.q=2 asPath=/?q=2       <-- correct
```

## Expected

The row with the fragment in `as` should behave like the row without it: the second
click should update `router.query.q` to `2`.
