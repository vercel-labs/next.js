# Repro attempt: issue #97292 — Turbopack + variable-assigned default export in `postcss.config.mjs`

Minimal Next.js 16.3.0 app that follows the exact steps in
https://github.com/vercel/next.js/issues/97292
(the linked repo `amoh909/nextjs-turbopack-postcss-bug` is not a runnable Next app: it only
contains `package.json`, `globals.css` and a `postcss.config.mjs` that already uses the
inline-object form the reporter says works).

## Run

```bash
npm install
npm run dev   # then open http://localhost:3000
```

`postcss.config.mjs`:

```js
/** @type {import('postcss-load-config').Config} */
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

## Result on next@16.3.0 (Linux, Node 24.17, npm and pnpm)

No `Error evaluating Node.js code` / `PostCSS config is undefined`.
`globals.css` compiles through `@tailwindcss/postcss` (Tailwind utilities such as
`.text-3xl` are present in `/_next/static/chunks/app_globals_*.css`), and `next build`
succeeds. Also clean with CRLF line endings, a UTF-8 BOM, `"type": "module"`,
array-form `plugins`, a project path containing spaces, and after editing the config
from inline-object to variable form while the dev server is running.
