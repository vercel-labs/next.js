# Repro: next#93419 — spurious Lightning CSS warning for `:target-current`

Mirror of the reporter's zip (https://github.com/vercel/next.js/issues/93419).

## Run
```
npm install
npm run dev
# open http://localhost:3000
```

## Observed (next 16.2.4, Turbopack)
`next dev` prints "Parsing CSS source code failed" / "'target-current' is not
recognized as a valid pseudo-class..." for `src/app/page.module.css:32`, even
though the selector is valid CSS and the emitted stylesheet contains the rule.
