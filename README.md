# Reproduction: boundary (loading / template / error / not-found) chunk `<script>` tags are emitted without the CSP nonce

Upstream issue: https://github.com/vercel/next.js/issues/97882

`packages/next/src/server/app-render/create-component-styles-and-scripts.tsx`
creates the `<script async src>` elements for a segment's
loading / not-found / error / template boundaries **without** `nonce`, while
`get-layer-assets.tsx` (layouts / pages) creates the same elements **with**
`nonce: ctx.nonce`.

## Run

```bash
npm install
npm run build
npm start          # next start on :3000
npm run check      # fails: lists <script> tags in the HTML without the nonce
npm run test:csp   # optional: Playwright, shows Chromium blocking those scripts
```

Observed with `next@16.3.3` (Turbopack build, `next start`):

```
CSP nonce: NDUwZmExN2MtZWY4NS00MjNlLTlhYzUtMzc5MjlhNDdjYmRk
<script> tags: 16, without the nonce: 2
  MISSING NONCE -> <script src="/_next/static/chunks/2rh7cftm5mvrr.js" async="">
  MISSING NONCE -> <script src="/_next/static/chunks/2o2y4o6wykmma.js" async="">
```

Chromium then refuses both:

```
Loading the script 'http://localhost:3000/_next/static/chunks/2rh7cftm5mvrr.js'
violates the following Content Security Policy directive:
"script-src 'self' 'nonce-…' 'strict-dynamic'" … The action has been blocked.
```

## How the chunk graph is forced

`middleware.ts` sets a per-request nonce in the `Content-Security-Policy`
request *and* response header (the documented pattern).

`app/loading.tsx` and `app/template.tsx` each import a client component that is
**not rendered** (`process.env.SHOW_SPINNER` / `SHOW_EXTRA` are unset). The
client component stays in the boundary's module graph, so its chunk appears in
`entryJSFiles["[project]/app/loading"]` / `["[project]/app/template"]` of
`.next/server/app/page_client-reference-manifest.js`, but no client reference
serialized for the request pulls that chunk in. That is the minimal stand-in for
the reporter's "boundary-only chunk": nothing preinits it with the nonce first,
so React's hoistable dedupe cannot hide the nonce-less element.

If the boundary components are rendered instead, the same chunks are preinited
by Flight *with* the nonce and the bug is masked — matching the reporter's
"chunk-graph accident" description.

`app/page.tsx` awaits `connection()` (dynamic render, so the per-request nonce
applies) plus a 500 ms delay, so the `loading.tsx` fallback is flushed into the
initial HTML as well.

## Fix verification

Adding `nonce: ctx.nonce` to the `createElement('script', …)` call in
`create-component-styles-and-scripts.tsx` (patched into
`node_modules/next/dist/compiled/next-server/app-page-turbo.runtime.prod.js`)
makes `npm run check` report `without the nonce: 0`.
