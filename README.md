# Repro: vercel/next.js#71795

`router.replace()` (and `router.push()`) from `next/navigation` does not dismiss a modal
rendered by an intercepting route in a parallel-route slot; the URL updates but the
`@modal` slot keeps rendering the intercepted page instead of falling back to `default.js`.
`router.back()` works.

Reporter's linked repo (github.com/2dubbing/nextgram) is deleted (404), so this is a minimal repro.

## Run

```
npm install
npm run dev
# open http://localhost:3000, click "photo 1", then click "X (replace)"
```

Automated check (needs the dev server running on :3000):

```
npx playwright install chromium
node test.mjs
```

Output on next@16.3.1 (dev Turbopack and `next build && next start`):

```
after link click: url=http://localhost:3000/photo/1 modalVisible=true
after router.replace("/"): url=http://localhost:3000/ modalVisible=true   <-- bug
control router.back(): url=http://localhost:3000/ modalVisible=false
```
