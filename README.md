# Repro: next build fails when generateStaticParams() returns [] with output: export (#74201)

    npm install && npm run build

`app/blog/[slug]/page.js` exports `generateStaticParams()` returning `[]` and
`next.config.js` sets `output: 'export'`.

Observed:
- next@15.1.2: `Error: Page "/blog/[slug]" is missing "generateStaticParams()" so it cannot be used with "output: export" config.` (misleading: it is present)
- next@16.3.1-canary.25: `Error: Page "/blog/[slug]" returned an empty array from "generateStaticParams()". With "output: export", at least one route must be generated.`

Build exits with code 1 in both cases.
