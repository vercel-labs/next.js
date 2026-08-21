# Repro: next.js#90080 — Safari quit/reopen + Back leaves stale page content

Safari restores `history.state` only for the entry that was active when the browser
was quit; entries further back are restored with `state === null`. When the user
presses Back, the Next.js router receives a `popstate` with a `null` state, updates
the URL, but never renders the previous route — the last visited page stays on screen.

`repro.mjs` reproduces this deterministically in headless Chromium by nulling the
state of the entry that is about to become the previous entry (`history.replaceState(null, '', location.href)`),
which is exactly the state Safari hands back after a session restore.

## Run

```bash
npm install
npm run build && npm start &   # or: npm run dev
npm run repro
```

Covers both the App Router (`/` -> `/route-1`) and the Pages Router
(`/pages-home` -> `/pages-route-1`).

Expected: after Back the URL and the content both go back to the home route.
Actual: the URL becomes the home route while the "Route 1" content stays mounted.
