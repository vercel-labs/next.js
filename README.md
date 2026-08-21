# Repro: delayed Suspense reveal after a fast server await (next.js#77759)

Minimal reproduction of https://github.com/vercel/next.js/issues/77759.

`app/page.jsx` renders a `<Suspense>` boundary whose async server child either

* `mode=fetch` – awaits an uncached `fetch()` on the server (~50-100ms), or
* `mode=timeout&ms=50` – awaits `setTimeout(50)` on the server, or
* `mode=timeout&ms=1000` – awaits `setTimeout(1000)` on the server.

Both the fallback and the resolved child are client components that log
`render` / `mount` / `unmount` with `Date.now()`.

## Run

```bash
npm install
npm run dev              # http://localhost:3002
# then, in another shell (needs playwright + a chromium install):
npm i -D playwright && npx playwright install chromium
node measure.mjs http://localhost:3002
```

Or manually: open http://localhost:3002, open the console, click `fetch`, then
compare the timestamps of `[ClientComponent] render` and
`[SuspenseComponent] unmount`.

## Observed

```
fetch:            children rendered -> fallback removed = ~270ms, fallback visible = ~297ms
timeout 50:       children rendered -> fallback removed = ~260ms, fallback visible = ~298ms
timeout 1000:     children rendered -> fallback removed = ~1ms,   fallback visible = ~980ms
```

The children commit as soon as the RSC payload arrives, but the fallback stays on
screen until it has been visible for ~300ms, so nothing is painted for ~270ms.
The trigger is not `fetch` – any server await shorter than ~300ms behaves the
same, which matches React's throttling of Suspense fallback removal
(see facebook/react#31819). Reproduces in `next dev` and in `next build && next start`.
