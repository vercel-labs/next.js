# Repro: #53717 generateStaticParams does not pass parent params to child

Parent `generateStaticParams` lives in `app/[slug]/page.js`.

    npm install && npx next build

Observed (Next 16.3.1-canary.25): child `generateStaticParams` logs `received params: {}`
and no `/[slug]/[id]` routes are prerendered. Moving the parent `generateStaticParams`
into `app/[slug]/layout.js` makes the child receive `{"slug":"1"}` / `{"slug":"2"}` and
prerenders 4 pages. With `next dev`, `/12314/iasd` returns 200 despite `dynamicParams = false`.
