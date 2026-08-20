# Repro: fetch cache never revalidates when the upstream turns into a 404

Reproduces https://github.com/vercel/next.js/issues/62920 with a local upstream API so no
third-party mock service is needed.

- `upstream-server.mjs` – tiny API on `:9099`. `GET /products/:id` returns 200 until
  `POST /admin/delete/:id` "deletes" the product, after which it returns **404**.
- `app/products/[id]/page.tsx` – server component doing `fetch(..., { next: { revalidate: 5 } })`
  and calling `notFound()` when the upstream status is 404.
- `app/probe/route.ts` – force-dynamic route handler doing the same fetch and echoing the
  status/body actually returned to user code (isolates the fetch cache from the route cache).

## Run

```bash
npm install
npm run repro
```

## Result (Next.js 16.3.1, also reported on 14.x / 15.x)

The upstream log shows Next.js re-requests the URL on every request after the 5s revalidate
window and receives `404` each time, but `fetch()` in the server component/route handler keeps
resolving with the **stale 200 body indefinitely**, so `/products/2` keeps returning 200 instead
of the 404 page. A changed *200* body, by contrast, is picked up on the next request.
