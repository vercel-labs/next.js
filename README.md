# Repro: `next/script` `beforeInteractive` in a localized root layout (`app/[locale]/layout.tsx`)

Issue: https://github.com/vercel/next.js/issues/97602 (docs question)

The root layout lives at `app/[locale]/layout.tsx`, reads `locale()` from `next/root-params`
for `<html lang>`, and renders `<Script src="/bi.js" strategy="beforeInteractive" />`.

## Run

```bash
npm install
npm run build
npm start
# then: curl -s http://localhost:3000/en | grep bi.js
```

## Result (Next.js 16.3.1-canary.25)

Works. `next build` succeeds (`/en`, `/fi` prerendered, `/[locale]` PPR),
`<html lang="en">` / `<html lang="fi">` are correct, and the produced HTML is byte-for-byte
equivalent in script handling to the same app with a plain `app/layout.tsx`:

- `<link rel="preload" href="/bi.js" as="script"/>` in `<head>`
- `<script>(self.__next_s=self.__next_s||[]).push(["/bi.js",{"id":"before-i"}])</script>` early in `<body>`
- In the browser `window.__BEFORE_INTERACTIVE__ === 'ran'`

The `no-before-interactive-script-outside-document` ESLint rule does not apply here either: it
returns early for any file under `app/` (see
`@next/eslint-plugin-next/dist/rules/no-before-interactive-script-outside-document.js`).

So the docs statement that a `beforeInteractive` script "must be placed inside `app/layout.tsx`"
should be reworded to "the root layout" (whatever its path, including `app/[locale]/layout.tsx`).
