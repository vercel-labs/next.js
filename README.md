# Reproduction: vercel/next.js#74234

`<Image loading="eager" />` (without `priority`) and plain `<img loading="eager">`
still emit `<link rel="preload" as="image">` in the SSR HTML.

## Run

```bash
npm install
npm run build && npm run start   # or: npm run dev
node verify.mjs                  # prints which images were preloaded
```

## Pages

- `/` (App Router) and `/pages-router` (Pages Router) each render:
  1. `priority` -> preload expected
  2. `loading="eager"` only -> **preload NOT expected, but emitted**
  3. default (lazy) -> no preload
  4. plain `<img loading="eager">` -> **preload emitted**
  5. `loading="eager" fetchPriority="low"` -> no preload (workaround)

## Observed on next@16.3.1 / react-dom@19.2.0 (dev and next start)

```
/            -> preloaded images: priority, eager, plain
/pages-router-> preloaded images: priority, eager, plain
```

Root cause: React DOM's SSR `img` handling auto-preloads any `<img>` whose
`loading !== "lazy"` and `fetchPriority !== "low"`
(`react-dom/cjs/react-dom-server.node.production.js`, `case "img"`).
`next/image` leaves `fetchPriority` undefined for non-priority images, so
`loading="eager"` opts them into React's automatic image preload.
In Next 16 this now affects the Pages Router as well.
