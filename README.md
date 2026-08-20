# Repro: Next.js issue #72909

`<Link />` navigation and server-action `redirect()` call an app-router `route.js` `GET` handler twice.

## Run

```bash
npm install
npm run dev      # or: npm run build && npm start
```

Open http://localhost:3000 and click "Link to /route", "Link to /route without prefetch",
or "redirect to /route". Watch the terminal: `ROUTE HANDLER CALLED` is logged twice per click
(first with `?_rsc=...` / `rsc: 1` header from the RSC prefetch/navigation request, then again
for the real document request). Clicking the `/page-target` links logs `PAGE RENDERED` only once.

Automated check (server must be running):

```bash
node test.mjs
```
