# Repro: vercel/next.js#53651 — `beforeInteractive` scripts duplicated during SSR

Next.js `16.3.1-canary.25` (Node 24). Both App Router and Pages Router affected.

## Run

```bash
npm install
npm run build && npm start
# then, in another shell:
npx playwright install chromium
node check.mjs   # duplicated: beforeInteractive
node check2.mjs  # control: afterInteractive dedupes
```

## Routes

| Route | Strategy | Rendered | `window.__dupCount` |
| --- | --- | --- | --- |
| `/` (app) | `beforeInteractive` | 3x same `id`+`src` | **3** |
| `/pages-repro` (pages) | `beforeInteractive` | 3x same `id`+`src` | **3** |
| `/after` (app) | `afterInteractive` | 3x same `id`+`src` | 1 |
| `/after-pages` (pages) | `afterInteractive` | 3x same `id`+`src` | 1 |

## Observed HTML

Pages Router emits three identical tags:

```html
<script id="dup-script" src="/counter.js" defer data-nscript="beforeInteractive"></script>
<script id="dup-script" src="/counter.js" defer data-nscript="beforeInteractive"></script>
<script id="dup-script" src="/counter.js" defer data-nscript="beforeInteractive"></script>
```

App Router emits three identical runtime pushes:

```html
<script>(self.__next_s=self.__next_s||[]).push(["/counter.js",{"id":"dup-script"}])</script>
```

`/counter.js` increments `window.__dupCount`, so the browser console logs it 3 times.

## Note

`packages/next/src/client/script.tsx` appends to `context.scripts[strategy]` with
`.concat(...)` and pushes `self.__next_s` per render, with no `id`/`src` dedupe —
unlike `afterInteractive`/`lazyOnload`, which are guarded by `LoadCache`.
