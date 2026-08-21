# Repro: Duplicate metadata from `generateMetadata` after Server Action revalidation (#83510)

Minimal reproduction of https://github.com/vercel/next.js/issues/83510

`app/page.js` exports `generateMetadata()` (title + description). A client component calls a
Server Action that runs `revalidatePath('/')`. After that action resolves, the document head
contains **two** `<title>` elements and **two** `<meta name="description">` tags.

## Run

```bash
npm install
npm run dev            # or: npm run build && npm start
npx playwright install chromium
npm run check          # prints title/description counts from the live DOM
```

Or manually: open http://localhost:3000, wait for the `useEffect` server action to resolve,
and inspect `<head>` in DevTools.

## Observed (next@16.3.1-canary.26 and next@15.5.4, dev and next start)

```
after-mount-effect-action {"titles":["My Title","My Title"],"descs":["My Description","My Description"]}
after-manual-click-1     {"titles":["My Title","My Title"],"descs":["My Description","My Description"]}
```

Initial SSR HTML has exactly one `<title>`; duplication appears only after the
`revalidatePath` server action response is applied on the client. A control route with
`generateMetadata` but no server action stays at one `<title>`.

## Expected

One `<title>` and one `<meta name="description">`.
