# next#49988 — wrong `generateMetadata` used with parallel routes

Reproduction for https://github.com/vercel/next.js/issues/49988

```
npm install
npm run dev
```

Then open:

- http://localhost:3000/%40hello/world → body `@workspace`, title `@workspace` (correct)
- http://localhost:3000/hello/world → body `@category`, but title is `@workspace` (BUG, expected `@category`)

The `[root]/layout.tsx` renders the `@workspace` slot when the slug starts with `@`,
and the `@category` slot otherwise. The rendered page comes from the right slot, but
the metadata is always taken from the last slot alphabetically (`@workspace`).
