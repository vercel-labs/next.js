# Repro: `stopPropagation()` in App Router does not stop native `document.body` listeners (next#65397)

Next.js 16.3.1 / React 19 (also reported on 14.3.0-canary.40).

```bash
npm install
npm run dev
# open http://localhost:3000/ (app router) and http://localhost:3000/pages-router
# hover the red box, watch the console
```

App Router (`app/page.tsx`) — the body listener fires **before** the React handler, so
`e.stopPropagation()` cannot prevent it:

```
BODY mouseover fired (app router)
BOX onMouseOver + stopPropagation (app router)
```

Pages Router (`pages/pages-router.tsx`) — the body listener never fires:

```
BOX onMouseOver + stopPropagation (pages router)
```

Cause: in the App Router React hydrates the whole document, so its delegated event
listeners live on `document`, which is *above* `<body>`. In the Pages Router the root
container is `div#__next` inside `<body>`, so React's delegated listener runs first and
`stopPropagation()` on the native event blocks the `body` listener.

Automated check (requires a Chromium binary path in `test.mjs`):

```bash
node test.mjs
```
