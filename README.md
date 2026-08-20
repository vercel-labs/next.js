# Repro: vercel/next.js#73051

`output: 'export'` + custom `distDir` makes `next start` fail with a misleading
"Could not find a production build in the 'build' directory" error instead of the
correct `"next start" does not work with "output: export"` error.

## Run

```
npm install
npm run build   # export output -> ./build, internal build artifacts -> ./.next
npm start       # Error: Could not find a production build in the 'build' directory
```

Removing `distDir: 'build'` from next.config.mjs yields the correct message:
`Error: "next start" does not work with "output: export" configuration. Use "npx serve@latest out" instead.`

Reproduced with next@16.3.1-canary.25 on Node 24.
