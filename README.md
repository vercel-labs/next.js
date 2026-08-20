# Repro: loading.tsx CSS breaks CSS module precedence (next dev) — vercel/next.js#75539

## Setup
    npm install
    npm run dev   # open http://localhost:3000

## Files
- `app/square.module.css` — `.square { background: blue }`
- `app/page.module.css` — `.square { background: green }` (imported *after* square.module.css in `app/page.js`, so it must win)
- `app/loading.js` — imports only `square.module.css`
- `app/page.js` — async (1s delay) so `loading.js` renders first

## Expected
After the page resolves, the square is **green** (page.module.css wins, as it does when `app/loading.js` is deleted).

## Actual (`next dev`, Next 16.3.1 and 15.x)
The square stays **blue**. Two stylesheets are injected:
1. `app_...._.css` (square + page modules, green last)
2. `app_square_module_....css` (loading's copy of square.module.css, blue)

The second link is appended after the page CSS, so the blue rule wins again.

`next build && next start` is unaffected here because the page is prerendered and loading.js CSS is never injected.
