# Repro: no way to read a POST request body in `app/**/page.tsx` (issue #92919)

Next.js 16.3.1 / App Router.

- `app/page.tsx` — plain `<form method="post" action="/post-page">` with a hidden `email` field.
- `app/post-page/page.tsx` — a Page (not a Route Handler) that dumps the keys of its props.

## Run

```bash
npm install
npm run dev            # http://localhost:3000
curl -i -X POST -d 'email=user@example.com' http://localhost:3000/post-page

npm run build && npm start
curl -i -X POST -d 'email=user@example.com' http://localhost:3000/post-page
```

## Observed

- dev: `200 OK`, the page renders, and props are only `["params","searchParams"]`. The request body is silently discarded; there is no API (`headers()` has no body, no `request` argument) to read it.
- production: `200 OK` with `x-nextjs-cache: HIT` / `x-nextjs-prerender: 1` — the POST is answered from the static prerender, so the body cannot influence rendering at all.
- A `route.ts` in the same segment can read the body but conflicts with `page.tsx`, so one URL cannot both handle POST and render UI.
