# Repro: next#69770 — app router ignores `generateStaticParams` when matching ambiguous dynamic routes (dev only)

Two sibling dynamic app routes:

- `app/[postSlug]/page.tsx` — `generateStaticParams` => `post-1`, `post-2`
- `app/[...pageSlug]/page.tsx` — `generateStaticParams` => `page-1`, `page-2`

## Run

```bash
npm install
npm run dev   # http://localhost:3000
```

Visit `/post-1`, `/post-2`, `/page-1`, `/page-2`.

- dev: all four render **POST route** (`app/[postSlug]`), `/page-*` never reaches the catch-all page route.
- `npm run build && npm start`: `/page-*` correctly render **PAGE route**.

Dev route matching uses only the filesystem-derived regex and ignores `generateStaticParams`,
so the more specific `[postSlug]` route swallows params it never declared.
