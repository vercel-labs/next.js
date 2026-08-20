# Repro: issue #55208 — middleware/proxy breaks Pages Router URL masking (`as` prop)

Reporter's CodeSandbox/GitHub repo (`ValenCassa/bug-next`) is deleted (404), so this is a minimal rebuild.

## Run

```bash
npm install
npm run dev          # proxy.js (middleware) present  -> BUG
# then, control run:
mv proxy.js proxy.js.off && npm run dev   -> correct
node test.mjs my-label   # playwright driver, prints results + screenshots
```

## Expected vs actual

Clicking `<Link href="/original" as="/masked">`:

- Without `proxy.js`/`middleware.js`: URL bar shows `/masked`, page rendered is **original page** (correct masking).
- With a no-op `proxy.js` / `middleware.js` returning `NextResponse.next()`: URL bar shows `/masked` but page rendered is **masked page** — the `href` is ignored and the `as` path is navigated to.

Reproduced on next@16.3.1-canary.25 in `next dev` (Turbopack) and `next build && next start`,
with both the legacy `middleware.js` and the new `proxy.js` convention.
