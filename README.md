# Repro: vercel/next.js#68207 — global CSS ordered after client-component CSS Module

`app/layout.js` imports `app/globals.css` (`.header { background-color: lightcoral }`) and renders
the client component `app/components/Header.js`, which imports `header.module.css`
(`.header { background-color: lightgreen }`). Both selectors have equal specificity, so the
later-emitted rule should win, and the CSS Module (imported deeper in the tree) should come last.

## Run

    npm install
    npm run dev        # webpack bundler -> BUG: header is lightcoral rgb(240,128,128)
    npm run dev:turbopack  # -> correct: header is lightgreen rgb(144,238,144)

Open http://localhost:3000 and inspect the `<header>` background, or the emitted stylesheet
(`/_next/static/css/app/layout.css` with webpack): `header.module.css` is emitted *before*
`globals.css`.

Also reproduces on next@14.2.5 (webpack, dev and next build/start).
