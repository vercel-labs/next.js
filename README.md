# Repro: next.js#83017 — `<title>` shows the request URL while async `generateMetadata` is pending

The reporter's linked repo (`tmoutinho/assignment`) is an unrelated chatbox app, so this is a
minimal reproduction built from the snippets in the issue.

`app/page.tsx` is `force-dynamic` with an async `generateMetadata()` that awaits a 1.5s API route.
The root layout defines `title: { default: "Demo App" }`.

## Run

```bash
npm install
npm run dev            # or: npm run build && npm start
node title-probe.mjs   # samples document.title over time (Playwright)
node dom-probe.mjs     # counts <title> elements while metadata is pending
```

## Observed (Next.js 16.3.1, React 19.2.0)

Streamed shell contains **no `<title>` element** for the whole `generateMetadata` await, so the
browser labels the tab with the request URL and the layout's `title.default` is never used.

```
$ node dom-probe.mjs
pending:  head titles = 0 | document.title = ""
resolved: head titles = 1 | document.title = "Fetched Title"

$ node title-probe.mjs        # next start
--- direct load / ---
t+102ms  title="Loading http://localhost:3000/"
t+202ms  title=""
t+1705ms title="Fetched Title"
--- client nav /other -> / ---
t+100ms  title=""            # previous route title "Demo App" is dropped immediately
t+1605ms title="Fetched Title"
```

Raw HTML stream (`next dev`): first bytes arrive at t+0.03s, `<title>Fetched Title</title>` only at t+1.55s.
