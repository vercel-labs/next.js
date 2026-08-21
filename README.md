# Reproduction for vercel/next.js#78289 — child route incorrectly intercepted by adjacent route

A `(.)` intercepting route that lives under a **dynamic** parent segment produces an interception
rewrite whose source is `/:section/:id` and whose `has: Next-Url` condition matches *any* URL.
That rewrite therefore hijacks the unrelated adjacent route `/list/[id]`.

## Routes

```
app/
  page.js                       -> /
  list/[id]/page.js             -> /list/1        (adjacent, unrelated route)
  [section]/layout.js           -> renders the @modal slot
  [section]/page.js             -> /photos
  [section]/[id]/page.js        -> /photos/9      (full page)
  [section]/@modal/(.)[id]/page.js  -> modal that intercepts /photos/9
```

## Steps

```bash
npm install
npm run dev
```

1. Open `/photos`
2. Click `/photos/9` (soft navigation) — the modal opens, as expected
3. Click `/list/1` (soft navigation)

### Expected

`/list/1` renders `list id param = "1"`.

### Actual (next 15.3.1-canary.11)

`/list/1` renders `list id param = "(.)1"` — the interception marker leaks into the param.

Reproducible without a browser:

```bash
curl -s localhost:3000/list/1                          # id = "1"      (correct)
curl -s localhost:3000/list/1 -H 'Next-Url: /photos'   # id = "(.)1"   (bug)
```

Requesting the rewritten path again makes the rewrite re-apply and accumulate markers, which is the
500 reported in the issue comments:

```bash
curl -s --path-as-is 'localhost:3000/list/(.)1' -H 'Next-Url: /photos'
# Error: Invalid interception route: /list/(.)(.)1. Must be in the format ...
```

### Actual (next 16.3.1-canary.26)

Step 3 does not even render `app/list/[id]`: `/list/1` renders the `[section]` page with the
intercepting modal (`MODAL id="1"`).

## Why

`generateInterceptionRoutesRewrites` derives the rewrite from the app path
`/[section]/@modal/(.)[id]`:

```
source:      /:section/:id
destination: /:section/@modal/(.):id
has:         header Next-Url ~ (?:\/([^\/#\?]+?))(?:\/(.*))?[\/#\?]?   // matches everything
```

`/list/1` matches `source`, so it is rewritten to `/list/(.)1` and `app/list/[id]` receives
`id = "(.)1"`.
