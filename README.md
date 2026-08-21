# Reproduction for vercel/next.js#79375

`NextResponse.rewrite(request.nextUrl)` in middleware duplicates any query
parameter whose **key** contains a space, adding a second entry with an empty
value — but only when deployed on Vercel.

## Run

```bash
npm install
npm run build && npm start   # local: NOT affected
# or deploy to Vercel        # deployed: affected
```

Then request:

- `/buggy/x?a+b=c` → deployed on Vercel returns `{"a b": ["c", ""]}`
- `/fixed/x?a+b=c` → `{"a b": "c"}` (query re-encoded with %20 in middleware)
- `/target-page?a+b=c` → `{"a b": "c"}` (no middleware rewrite)

`next start` locally returns `{"a b": "c"}` for all three, so only the Vercel
routing layer that consumes `x-middleware-rewrite: /target-page?a+b=c`
duplicates the parameter. Note that `NextURL` normalizes `?a%20b=c` to
`?a+b=c` when serializing the rewrite destination, so `%20` input is affected
too.

Verified with next 15.5.23 and 16.3.1.
