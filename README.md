# Repro: next.js#64870 — `app/[lang]/not-found.jsx` ignored for unmatched nested paths

Next.js 15.5.4 (also reported on 14.1.2).

## Run

```bash
cd repro && npm install && npm run dev   # http://localhost:3000
# /en           -> 200, app/[lang]/page.jsx
# /en/pricing   -> 404, DEFAULT Next.js "This page could not be found" (BUG)
# /en/a/b       -> 404, DEFAULT Next.js 404 page (BUG)
```

Control (no dynamic locale segment, `app/not-found.jsx`):

```bash
cd control && npm install && npm run dev  # http://localhost:3002
# /pricing, /a/b -> 404 with the custom not-found page (expected behavior)
```

Same result with `npm run build && npm start`; the build output only lists a
default `/_not-found` route, so `app/[lang]/not-found.jsx` never acts as the
global 404 boundary for unmatched URLs.
