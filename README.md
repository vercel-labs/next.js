# Demo: middleware runs for Server Action requests (issue #63270)

Docs gap: middleware behavior for Server Actions is undocumented.

Observed with Next.js 16.3.1 (also applies to >= 14.1):
a Server Action invocation is a POST to the URL of the page/route the action was
called from, carrying a `next-action` header, and middleware matched by that
pathname runs for it and can short-circuit it.

## Run

```
npm install
npm run dev
# in another shell
curl -s localhost:3000/dashboard -o dash.html
ID=$(grep -o '[0-9a-f]\{40,\}' dash.html | head -1)
curl -i -X POST localhost:3000/dashboard -H "next-action: $ID" -H 'Content-Type: application/json' -d '[]'
curl -s localhost:3000/protected -o p.html
ID2=$(grep -o '[0-9a-f]\{40,\}' p.html | head -1)
curl -i -X POST localhost:3000/protected -H "next-action: $ID2" -H 'Content-Type: application/json' -d '[]'
```

Server log:
```
[middleware] POST /dashboard next-action=true
[server action] ran from /dashboard
[middleware] POST /protected next-action=true
[middleware] blocking server action on /protected
```
`/protected` action returns 401 from middleware and the action body never runs.
