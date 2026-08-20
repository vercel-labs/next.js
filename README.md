# Reproduction: vercel/next.js#45000

Catch-all route and nested dynamic route in the same directory: client-side
navigation (`router.push` / `<Link>`) resolves to the wrong page.

Routes:
- `pages/[category-slug]/[...rest]/index.js` (prerenders `/hair/shop-by-hair-type/dry-scalp`)
- `pages/[category-slug]/[collection-slug]/[product-slug]/index.js` (prerenders `/hair/shampoo/some-shampoo`)

## Run

```
npm install
npm run build && npm start
# open http://localhost:3000 and click "router.push" or the Link
```

## Observed (next@canary 16.3.1-canary.25)

- Hard load of `/hair/shop-by-hair-type/dry-scalp` renders the catch-all page (correct).
- `router.push` / `<Link>` to the same URL renders the `[collection-slug]/[product-slug]`
  component, while the props displayed come from the catch-all page's data
  (`{"category-slug":"hair","rest":["shop-by-hair-type","dry-scalp"]}`) — component/data mismatch.
- `next dev` renders the `[product-slug]` page even on hard reload, so dev and
  production server resolution also disagree.
