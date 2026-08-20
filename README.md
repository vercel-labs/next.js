# Repro: issue #66751 — page remounted / loading boundary re-triggered when params of an (optional) catch-all change

App structure:
- `app/[[...catchAll]]/page.tsx` — main slot, optional catch-all, 1.5s artificial delay, client `Counter` state
- `app/[[...catchAll]]/loading.tsx` — loading boundary of the main slot
- `app/@modal/default.tsx`, `app/@modal/photo/[id]/page.tsx` — parallel slot

## Run

```bash
npm install
npm run dev        # or: npm run build && npm start
# then:
node check.mjs     # requires `npm i playwright` and `npx playwright install chromium`
```

Manual: open `/`, click the counter twice, then click "+ open modal".

## Observed (next@16.3.1-canary.25, dev and start)
Clicking the link navigates `/` -> `/photo/1`. The main slot's `loading.tsx` is shown and the
client counter resets from `count: 2` to `count: 0`; params go from `[]` to `["photo","1"]`.

## Expected
Only the `@modal` slot navigation matters; the catch-all page should keep local state and
receive new params without remounting or re-triggering its loading boundary.

On next@14.2.14 and 14.2.15 the counter is preserved and no loading boundary appears
(there params stay `[]`, i.e. the page is not re-rendered at all).
