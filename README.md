# Repro: notFound() does not replace parent robots metadata (#67907)

Next.js 16.3.1. Root layout sets `robots: { index: true, follow: true }`.

- `/nf` calls `notFound()` in the page component
- `/nf-meta` calls `notFound()` inside `generateMetadata()`

Run:

```
npm install
npm run build && npm start
curl -s localhost:3000/nf | grep -o '<meta name="robots"[^>]*>'
curl -s localhost:3000/nf-meta | grep -o '<meta name="robots"[^>]*>'
```

Observed (dev, build+start, and after client-side nav): two conflicting tags
`<meta name="robots" content="noindex"/>` and `<meta name="robots" content="index, follow"/>`.
Expected: only `noindex`.
