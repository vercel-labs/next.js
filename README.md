# Repro for vercel/next.js#76651 — server HTML delivered inside `<div hidden id="S:n">`

The issue's linked file (`trantrongbinh/next-demo/src/app/page.tsx`) contains no `fetch`, so this
minimal app reproduces the reported HTML shape.

## Run

```bash
npm install
npm run dev      # then: curl -s localhost:3000/loading-boundary | grep -o 'div hidden id="S:[0-9]*"'
# or production
npm run build && npm start   # curl -s localhost:3001/loading-boundary
```

## Routes

| route | contents | out-of-order streaming? |
| --- | --- | --- |
| `/` | async page, `fetch` (no-store) | no |
| `/slow` | async page, 2s delay + `fetch` | no |
| `/loading-boundary` | same as `/slow`, plus `loading.js` | **yes** — `<div hidden id="S:1">` |
| `/suspense` | `<Suspense>` around async `fetch` child | **yes** — `<div hidden id="S:0">` |
| `/no-fetch` | static page | no |

So the hidden wrapper is not caused by `fetch` itself: it appears only when a Suspense boundary
(explicit, or the implicit one created by `loading.js`) lets React flush the shell with the
fallback and stream the resolved content afterwards.

## Observed (Next 15.5.7 and 16.3.1, dev and `next start`)

`/loading-boundary` HTML:

```html
<body><section class="flex-1"><!--$?--><template id="B:0"></template><p>Loading…</p><!--/$--></section>
...
<div hidden id="S:1"><div><section class="p-8 ..."><h1 ...>Next Starter ⚡ (25)</h1>...</section></div></div>
<script>$RC("B:0","S:1")</script>
```

With JS enabled the `$RC` script moves the content into place (`document.body.innerText` =>
`Next Starter ⚡ (25) ...`, no content left in a hidden div). With JS disabled the page shows only
`Loading…` and the real content stays inside `div[hidden][id^="S:"]`.
