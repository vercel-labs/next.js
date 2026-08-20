# Reproduction — vercel/next.js#71604: middleware cannot override or remove response headers on a rewrite

`middleware.js` rewrites two paths and mutates the response headers:

| path        | rewrite target                          |
| ----------- | --------------------------------------- |
| `/proxy`    | internal route handler `/api/origin`    |
| `/external` | another app on `http://localhost:4000/` |

Both targets respond with `x-modify-me: original-value`, `x-remove-me: should-be-removed`
and `cache-control: public, max-age=3600`.

The middleware does:

```js
res.headers.set('x-added-by-middleware', 'added')   // new header
res.headers.set('x-modify-me', 'modified-by-middleware') // override existing
res.headers.set('cache-control', 'no-store')             // override existing
res.headers.delete('x-remove-me')                        // remove existing
```

## Run

```bash
npm install
npm run origin &   # the "other app" on :4000
npm run dev        # or: npm run build && npm run start
npm run verify     # BASE_URL=http://localhost:3000
```

## Expected

For both paths: `x-modify-me: modified-by-middleware`, `cache-control: no-store`,
no `x-remove-me`.

## Actual (Next.js 15.0.0 and 16.3.1-canary.25, `next dev` and `next start`)

`/proxy` (internal rewrite): the added header appears and `set()` on `x-modify-me` /
`cache-control` wins, but `delete()` is ignored — `x-remove-me: should-be-removed`
is still sent.

`/external` (rewrite to another origin): every mutation of an existing header is
ignored — `x-modify-me: original-value`, `cache-control: public, max-age=3600`,
`x-remove-me: should-be-removed`. Only the brand-new `x-added-by-middleware` header
is applied.
