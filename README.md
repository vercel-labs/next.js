# Minimal repro: parallel routes cause N redundant RSC fetches on navigation

Issue: https://github.com/vercel/next.js/issues/65878

## Structure

- `app/[letter]/layout.tsx` – 20 parallel slots (`@slot1` … `@slot20`) + `children`
- `app/[letter]/page.tsx` – the only expensive segment (`await sleep(1000)`), logs each render
- `app/[letter]/loading.tsx` – loading boundary (removing it makes the bug disappear)
- `app/[letter]/@slotN/default.tsx` – cheap, returns `null`, logs each render
- 8 `<Link>` cards in the layout, default prefetching

## Run

```bash
npm install
npm run build
npm start           # http://localhost:3000/a
# then, in another shell (needs `npm i playwright` somewhere):
node measure.mjs http://localhost:3000 . run "ul a"
```

Or manually: open http://localhost:3000/a, open DevTools Network, click a card.

## Observed (next@15.5.7, production `next start`)

- One card click produces **21 RSC requests** to the same target route (`/b?_rsc=…`),
  one per parallel slot + page.
- Server log shows `[letter]/page.tsx RENDER letter=b` **21 times** for that single
  navigation — the 1 s page is re-rendered by every slot request (requests queue in
  batches of 6, so the navigation takes ~4 s instead of ~1 s).

## Expected

The expensive `[letter]/page.tsx` should be rendered once per navigation.

## Version matrix (same app, same script)

| next | RSC requests after one click | renders of the 1 s page |
| --- | --- | --- |
| 14.2.3 | 21 | 21 |
| 15.5.7 | 21 | 21 |
| 16.3.1-canary.24 | 1 | 1 |
