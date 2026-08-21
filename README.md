# Reproduction attempt for vercel/next.js#77828 — browser back navigation with dynamic routes

Minimal version of the reporter's repro (https://github.com/Yummygum/back-navigation-bug):
an `output: "export"` app with `/dog/[slug]` whose client component calls
`router.push()` from a `setInterval` every 3 seconds.

## Run

```bash
npm install
npm run build && npm run serve   # static export on http://localhost:3000
# or: npm run dev
```

Steps from the issue:

1. Type `/dog/1` in the address bar (no click inside the page, so the document has no user activation).
2. Wait while the page auto-pushes `/dog/2`, `/dog/3`, ...
3. Press the browser back button. Reported: you land on the blank new-tab page instead of the previous dog.

`/plain.html` is a control page that runs the same loop with raw `history.pushState()` and no
Next.js router, to distinguish an App Router bug from browser "history manipulation intervention"
(browsers may skip history entries a page pushed without user activation when the back button is used).

## Automated check

```bash
npm i -D playwright && npx playwright install chromium
npm run verify -- http://localhost:3000
```

## Result observed in this sandbox

Chrome for Testing 149.0.7827.55 on Linux, `next@15.3.0-canary.33` (the version in the report) and
`next@16.3.1-canary.26`, both `next dev` and `output: "export"` + `serve`:
back navigation is **correct**. Every back step (real toolbar back-button click driven with xdotool in
Xvfb, `Alt+ArrowLeft`, `history.back()`, and Playwright `page.goBack()`) returns
`/dog/3 -> /dog/2 -> /dog/1 -> / -> about:blank`, and `history.length` grows with each auto push.
The reported "blank new tab page" was not observed.
