# Reproduction: next#62046

Custom `error.tsx/jsx` is not rendered for dynamic app-router routes that use
`generateStaticParams` (ISR fallback) in a production build.

## Run

```bash
npm install
npm run build
npm start
```

Then open:

- http://localhost:3000/gsp/anything — route with `generateStaticParams` + `dynamicParams`.
  The server component throws. **Bug:** a plain `Internal Server Error` (built-in 500) is
  returned instead of `app/gsp/[slug]/error.jsx`.
- http://localhost:3000/nogsp/anything — identical route *without* `generateStaticParams`.
  `app/nogsp/[slug]/error.jsx` renders as expected.
- http://localhost:3000/gsp/prebuilt — prerendered param, renders fine.

`npm run dev` renders `app/gsp/[slug]/error.jsx` correctly for `/gsp/anything`,
so the difference is only in `next build` + `next start`.

Verified with next@16.3.1 (originally reported on 14.1.1-canary.52).
