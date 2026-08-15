# Repro: stale document title on App Router navigation between dynamic route params (#97417)

Next.js 16.3.1 (also 16.3.0), `cacheComponents: true` + `partialPrefetching: true`.

`/coin/[id]` exports `generateMetadata` returning a title derived from `params.id`.
Navigating home -> /coin/bitcoin -> back -> /coin/ethereum leaves `document.title` at
"Bitcoin" (one navigation behind). The URL and the page content are correct.

## Run

```bash
npm install
npm run build
npm start           # http://localhost:3000
node test.mjs       # playwright script printing url + title per step
```

Manual steps: open `/`, click "bitcoin" (title "Bitcoin"), go back, click "ethereum"
-> title stays "Bitcoin"; go back, click "solana" -> title stays "Ethereum".

Removing `partialPrefetching: true` makes titles correct. The bug also disappears if the
page renders no Client Component. Reproduces on 16.3.0 and 16.3.1; not reproducible on
16.3.1-canary.19.
