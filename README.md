# Repro: `next/script` inline `Script` is not placed in `<head>` (App Router) — vercel/next.js#52560

`app/layout.js` renders an inline `<Script id="google-analytics-inline">` (and an external one)
inside `<head>`.

```
npm install
npm run dev   # http://localhost:3001
# or: npm run build && npm start  # http://localhost:3001
curl -s http://localhost:3001 | grep -c dataLayer   # inline code is NOT in the SSR HTML head
```

Observed (Next.js 16.3.1-canary.25, dev and production):
- The SSR HTML `<head>` contains only `<link rel="preload" ... gtag/js>` for the external script;
  the inline script body appears nowhere as a real `<script>` tag (only inside the RSC flight payload).
- After hydration the inline script element is injected as the last child of `<body>`
  (`document.getElementById('google-analytics-inline').parentElement.tagName === 'BODY'`).

Expected: an inline `Script` declared in `<head>` is emitted in `<head>` of the server HTML.
