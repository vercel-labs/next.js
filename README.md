# Repro: `generateStaticParams` prevents `loading.tsx` from rendering (vercel/next.js#45317)

Next.js `16.3.1-canary.25`, React 19.2.0.

## Run

```bash
npm install
npm run build && npm start   # http://localhost:3000
# and/or: npm run dev
node test.mjs                # Playwright: BASE=http://localhost:3000 node test.mjs
```

Manually: paste a path in the input on the home page and press "Go (client nav)".

- `/blog/[slug]` has `generateStaticParams()` returning only `{ slug: 'a' }`, a `loading.tsx`, and a 4s delay in the page.
- `/nostatic/[slug]` is the control: identical page + `loading.tsx`, no `generateStaticParams`.

## Observed (`next build && next start`)

| navigation | loading.tsx shown | page content after |
| --- | --- | --- |
| `/blog/<random>` (not in generateStaticParams, generated on demand) | **no** | 4166ms |
| `/nostatic/x` (control, no generateStaticParams) | yes @117ms | 4112ms |

Client-side navigation to an on-demand-generated param of a route that uses
`generateStaticParams` freezes on the previous page for the whole 4s render;
`loading.tsx` never renders. Removing `generateStaticParams` restores it.

With `next dev` on this canary, `loading.tsx` renders in all cases (the original
dev-mode report appears fixed); the production path above still reproduces.
