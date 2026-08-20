# Reproduction: vercel/next.js#42461 — hydration breaks when a proxy rewrites SSR HTML (ESI tags)

Verified on `next@16.3.1-canary.25` (App Router, Turbopack dev).

## Run

```bash
npm install
npm run dev        # terminal 1: next dev on :3000
npm run proxy      # terminal 2: ESI-style proxy on :3001 (also tunnels the HMR websocket)
```

Open http://localhost:3001/ — the proxy replaces
`<esi:include src="foo.bar"></esi:include>` with `<div>foobar</div>` before the HTML
reaches the browser (mimicking Varnish / Cloudflare Worker / Lambda@Edge ESI).

Automated check (Playwright, collects console + DOM):

```bash
npx playwright install chromium-headless-shell
npm run check
```

## Observed

* `Hydration failed because the server rendered HTML didn't match the client...` with the diff
  `+ <esi:include src="foo.bar">` / `- <div>` (dev error overlay + console).
* After hydration the proxy-injected `<div>foobar</div>` is discarded and replaced by the original
  `<esi:include src="foo.bar">` element, so the ESI substitution is lost in the browser.
* Fast Refresh itself still works on canary (an edit to `app/page.tsx` is applied), but every load
  raises the hydration error. There is no way to mark a subtree as static/non-hydrated.
