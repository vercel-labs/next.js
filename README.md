# Repro: CSP response header + `loading.js` (Suspense) => client components never hydrate

Next `16.3.0-canary.87` (also reproduces on stable `16.2.10`) / React 19.2.7.

## Run

```bash
npm install
npm run build && npm start        # also reproduces with: npm run dev
```

Open **http://localhost:3000/slow directly** (fresh load / refresh — NOT a client nav) and click the counter.

- **Expected:** the counter increments.
- **Actual:** nothing happens. It never hydrated:
  ```js
  const b = document.querySelector("#counter");
  Object.keys(b).some(k => k.startsWith("__reactFiber$")); // => false
  ```

The SSR'd HTML is correct, every JS chunk returns 200, and there are no console errors — the client component is simply inert.

Now compare: from `/`, click the link to `/slow` (a **client navigation**) — the counter **works**. Only the direct load is broken, which makes this easy to miss in development.

## Bisection

| Variant | Hydrates? |
|---|---|
| `loading.js`, no CSP (delete `next.config.js`) | ✅ yes |
| CSP, no `loading.js` (delete `app/slow/loading.js`) | ✅ yes |
| **CSP + `loading.js`** | ❌ **no** |
| CSP + `loading.js`, but route is static (remove `force-dynamic`) | ✅ yes (never streams) |

So it is the **combination** of a CSP response header and a streamed Suspense boundary on a **dynamic** route.

- The route must be `ƒ Dynamic` — a prerendered/static route never streams at request time, so it will not reproduce.
- The fallback's content is irrelevant: a bare `<div>Loading…</div>` reproduces it.
- The CSP here says nothing about scripts — `frame-ancestors` is a framing directive — so it should have no bearing on hydration.

## Stages affected

Both `next dev` and `next build` + `next start`.

## Note on the served HTML

An affected (streamed) route's HTML ends with React's Suspense-completion call plus the streaming runtime:

```html
…$RC("B:0","S:0")</script></body></html>
```

An unaffected route ends with a normal `self.__next_f.push([...])`. The payload appears complete and the document is well-formed in both cases.
