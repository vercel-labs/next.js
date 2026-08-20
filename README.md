# Repro for vercel/next.js#65184 — how do you set the page title from a Client Component (App Router)?

Next.js `16.3.1`, React 19, App Router, Turbopack (default).

```bash
npm install
npx playwright install chromium

# dev
npm run dev            # http://localhost:3000
node verify.mjs http://localhost:3000

# prod
npm run build && npm start -- -p 3002
node verify.mjs http://localhost:3002
```

## Routes

| Route | What it tries |
| --- | --- |
| `/` | `export const metadata` in a Server Component (the documented path) |
| `/client-title-static` | React 19 `<title>` rendered by a Client Component |
| `/client-title?language=fr` | React 19 `<title>` from a Client Component, value derived from `useSearchParams()` |
| `/document-title?language=fr` | `document.title = ...` in `useEffect` (the workaround suggested in discussion #50872) |
| `invalid-examples/` | `metadata` / `generateMetadata` exported from a `'use client'` page — copy either file to `app/<route>/page.js` to see the build error |

## Observed (production, `next build && next start`)

```
/                            document.title = "Server component title (works)"
/client-title-static         HTML: <title>Root layout title</title> AND <title>Static client title</title>
                             document.title = "Root layout title"      <-- client <title> loses
/client-title?language=fr    document.title = "Root layout title"      <-- never becomes "Client <title> for fr"
/document-title?language=fr  document.title = "Root layout title"      <-- useEffect value is overwritten
client-side nav to /document-title  document.title = "Title for fr"    <-- only works after soft nav
```

In `next dev` the `<title>` rendered by the Client Component *does* win
(`document.title = "Client <title> for fr"`), so dev and prod disagree.

Copying `invalid-examples/client-metadata-page.js` to `app/client-metadata/page.js` gives:

```
Error: You are attempting to export "metadata" from a component marked with "use client", which is disallowed.
```

(same for `generateMetadata`), and in dev that compile error makes every other route return 500 until it is removed.

## Why this matters for the docs issue

`generate-metadata.mdx` documents that metadata is Server Component only and shows the
"wrap the Client Component" pattern, but it never says what to do when the title depends on
client-only state (`useSearchParams`, hooks). Both community answers fail in production:
`document.title` in `useEffect` is clobbered on initial load, and a React 19 `<title>` in a
Client Component is out-ranked by the metadata-generated `<title>`.
