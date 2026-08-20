# Repro: issue #17085 — next/head meta tags duplicated when a script appends elements to document.head

Reporter repro (https://github.com/jaybytez/head-elements) updated to run on modern Next.js.

`public/js/tagManager.js` appends 4 elements to `document.head`; `pages/index.js` sets 4 meta tags + title via `next/head`.

## Run
```
npm install
npm run dev   # http://localhost:3000
```
Inspect the live DOM (`document.head`), not view-source.

## Result
- next 9.5.3 (original era): charset / viewport / author are duplicated (3 dupes for 4 head appends, n-1) — bug reproduces.
- next 16.3.1 and 16.3.1-canary.25 (dev and `next build && next start`): exactly 5 head elements, no duplicates. Managed tags carry `data-next-head`.

Set `"next": "9.5.3"`, `react`/`react-dom` `16.13.1` in package.json (and `NODE_OPTIONS=--openssl-legacy-provider`) to see the original broken behavior.
