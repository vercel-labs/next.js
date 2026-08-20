# Repro: `http-equiv` meta tags cannot be emitted via the Metadata API (next#54437)

Next.js 16.3.1, App Router.

## Run

```bash
npm install
npm run dev       # http://localhost:3000
# or: npm run build && npm start
curl -s localhost:3000/metadata-other | grep -o '<meta[^>]*>'
curl -s localhost:3000/head-in-page  | grep -o '<meta[^>]*>'
```

## Observed (dev and production build are identical)

`/metadata-other` uses `metadata.other = { 'http-equiv': 'refresh', content: '...' }`:

```html
<meta name="http-equiv" content="refresh"/>
<meta name="content" content="5; URL=&quot;/target&quot;"/>
```

The keys are emitted as `name=` attributes, so no functional `http-equiv` refresh
(or CSP / content-type) tag can be produced through the Metadata API.

`/head-in-page` renders a `<head>` element inside the page component instead:

```html
<meta http-equiv="refresh" content="5; URL=&quot;/target&quot;"/>
```

This works (page redirects to `/target` after 5s), which is the workaround from the
issue. It is only present for GET responses, not HEAD.
