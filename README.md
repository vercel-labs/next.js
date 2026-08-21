# Repro: Next.js #83392 — route announcer crashes with browser translation

`Uncaught NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be
removed is not a child of this node.`

Chrome's built-in (Google) translation wraps text nodes in `<font>` elements. The
App Router route announcer (`next-route-announcer` shadow root) renders a bare
text child via `createPortal(routeAnnouncement, portalNode)`. Once that text node
has been moved into a translation `<font>` wrapper, the next navigation to a route
whose announcement is the empty string makes React *remove* that text node, which
now has a different parent → uncaught `NotFoundError`, and the whole app tree
unmounts into the global error screen.

`app/fake-google-translate.jsx` is a deterministic, ~40-line stand-in for the
browser translation feature (MutationObserver that wraps text nodes in `<font>`,
including inside shadow roots), so the crash can be reproduced headlessly without
manually toggling Chrome's translate UI.

## Run

```bash
npm install
npx playwright install chromium   # or set CHROMIUM_PATH to an existing Chrome
npm run dev &                     # http://localhost:3000
node test.mjs                     # exits 1 and prints the PAGEERROR
```

Manually (real Chrome translation, `next dev` or `next start`):

1. open `/` in a normal window, enable "Translate to …" from the ⋮ menu
2. click "Go to erroring page"
3. navigate back
4. click "Go to erroring page" again → client-side exception

## Notes

- `/` has `metadata.title`; `/erroring-page` has none and no `<h1>`, so the
  announcer announces `""` for it — that empty announcement is what removes the
  translated text node.
- Reproduces on `next@15.3.3` (dev and `next build && next start`) and on
  `next@16.3.1-canary.26`.
- Giving every route a title (or a root-layout fallback title) avoids the crash,
  because React then only mutates `nodeValue` instead of removing the node.
