# Reproduction for vercel/next.js#72133

Static/route indicator reports a page as **Static** in `next dev` even though the page
awaits `searchParams`, which is a Dynamic API. `next build` correctly marks the same
route as dynamic (`ƒ`).

## Run

```bash
npm install
npm run dev
# open http://localhost:3000/sp?a=1  -> dev tools "Route" badge says "Static"  (BUG)
# open http://localhost:3000/ck      -> dev tools "Route" badge says "Dynamic" (control, uses cookies())
# open http://localhost:3000/        -> "Static" (control, truly static)

npm run build
# Route (app)
# ┌ ○ /
# ├ ƒ /ck
# └ ƒ /sp   <- build says dynamic, dev says static
```

Reproduced with next@15.0.3-canary.2 (version in the issue) and next@16.3.1-canary.25.
On 15.0.3-canary.2 the dev server's `appIsrManifest` HMR message contains `{"/sp": true}`,
which is what turns the static indicator on.
