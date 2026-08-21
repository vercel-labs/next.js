# Repro: vercel/next.js#82037 — layout `metadata.title` overrides client-side `<title>` / `document.title`

Minimal reproduction of https://github.com/vercel/next.js/issues/82037.

- `app/layout.tsx` exports `metadata = { title: "Layout title" }`.
- `app/page.tsx` is a client component that renders `<title>Testing</title>` (React 19 hoisting) and sets `document.title = "Client page title"` in a `setTimeout(..., 1)` inside `useEffect`.

## Run

```bash
npm install
npx playwright install chromium   # only needed for `npm run check` (or set CHROME_PATH)
npm run dev                       # http://localhost:3002
# in another shell
npm run check                     # samples document.title for 3s, 5 loads
```

Also reproduces with `npm run build && npm run start`.

## Expected

Final `document.title` is `Client page title` (or `Testing` when the `useEffect` body is removed).

## Actual

Final `document.title` is `Layout title`. After hydration the head contains three
`<title>` elements and the layout-metadata one is inserted **first**, so the browser
(and `document.title`) uses it:

```
head <title> elements in order: ["Layout title","Client page title","Testing"]
```

Observed on next@15.4.4 (dev and start) and next@16.3.1-canary.26 (dev).
