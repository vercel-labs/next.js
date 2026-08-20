# Repro: vercel/next.js#72480 — CSS module chunk loaded in a `<script>` tag

    npm install
    npm run build
    npm start
    # open http://localhost:3000

## Expected
Both emitted stylesheets in `.next/static/css` are referenced with `<link rel="stylesheet">`
and the client component keeps its `1px solid #000` border.

## Actual (next 15.5.9)
The CSS-module chunk is injected as `<script src="/_next/static/css/<hash>.css" async>`,
the browser throws `Uncaught SyntaxError: Unexpected token '.'`, and the client component
style is not applied.

Trigger: `app/opengraph-image.js` importing the barrel (`./components`) that re-exports the
`"use client"` component which imports the CSS module. Deleting `app/opengraph-image.js`
makes both chunks load as `<link>` again.
