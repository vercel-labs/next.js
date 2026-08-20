# Reproduction: iframe `onLoad` handler does not fire in `next dev`

Repro for https://github.com/vercel/next.js/issues/69736

A client component renders three `<iframe onLoad={...} />`. `/remote` is a route
handler that stands in for the separate app hosted inside the iframe in the
original report (a Vite dev server on another port); `?delay=100` makes it
answer in ~100ms.

```bash
npm install

# dev: "loaded: false" for one or more frames, no `frame ... has loaded` logs
npm run dev

# production: "loaded: true" for all three frames, every reload
npm run build && npm start
```

Point the iframes anywhere else with `IFRAME_SRC=http://localhost:5173 npm run dev`.

## Observed (next@16.3.1-canary.25, React 19.2.0, headless Chromium)

| mode | result over 3 reloads |
| --- | --- |
| `next dev` | `false,false,true` / `false,false,true` / `true,true,true` |
| `next build && next start` | `true,true,true` x3 |

With the reporter's original repo (`next@14.2.8`, iframe -> Vite app on :5173)
dev shows `Loaded: false` for all three frames on every reload, while
`next build && next start` shows `Loaded: true` for all three. The iframe `load`
event fires before React hydration attaches the `onLoad` listener; dev hydration
is slow enough that the event is consistently missed.
