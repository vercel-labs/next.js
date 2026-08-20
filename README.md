# Repro: metadata `alternates.languages` drops path when value is a `URL` instance (vercel/next.js#68351)

    npm install
    npm run dev
    curl -s localhost:3000 | grep '<link rel="alternate"'

Actual (next@16.3.1-canary.25):

    <link rel="alternate" hrefLang="en-GB" href="https://example.com"/>
    <link rel="alternate" hrefLang="en-US" href="https://example.com"/>

Expected: the en-US link should be `https://example.com/us`.
Passing `new URL('/us','https://example.com').toString()` works, so `resolveAlternateUrl`
re-resolves the `URL` against the current pathname and loses `/us`.
