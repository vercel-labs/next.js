# Repro: hydration errors caused by a synchronous third-party `<script>` (issue #69478)

Minimal reproduction of https://github.com/vercel/next.js/issues/69478.

`app/layout.jsx` loads a **synchronous, render-blocking** `<script src="/ab-sync.js">`
in `<head>` (the pattern used by A/B-testing tools such as Convert Experiments in the
reporter's app). The script mutates the document while it is being parsed — before
React hydrates — exactly like an A/B tool applying a variant:

* appends a `<style>` to `<head>` and a class to `<html>`
* rewrites `#headline` text and inserts `#ab-banner` into `<body>` via `MutationObserver`

## Run

```bash
npm install
npm run dev      # open http://localhost:3000 with the browser console open
# or
npm run build && npm start
```

## Observed

* dev (14.2.7): `Warning: Text content did not match. Server: "Rewritten headline (variant B)" Client: "Original headline (variant A)"`,
  `An error occurred during hydration. The server HTML was replaced with client content in <#document>`,
  then `Text content does not match server-rendered HTML.` and a full client re-render of the root.
* production (`next build && next start`, 14.2.7): repeated minified React errors #425, #418, #423.
* Next 16.3.1-canary.25 + React 19.2.0: `Hydration failed because the server rendered HTML didn't match the client...`
  plus `Encountered a script tag while rendering React component...`.
* Replacing `public/ab-sync.js` with a no-op that does not touch the DOM produces **no**
  hydration error, so the sync `<script>` itself is fine — the pre-hydration DOM mutation is the cause.
