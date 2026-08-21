# Repro: `sassOptions.includePaths` + `additionalData` -> "Can't find stylesheet to import."

Issue: https://github.com/vercel/next.js/issues/85424

```bash
npm install
npm run dev   # open http://localhost:3000
```

Expected: page compiles, `.test` gets `background-color: #ff0000` from `assets/styles/_variables.scss`.

Actual (Next 16.3.1, Turbopack and Webpack): build error

```
./ui/TestComponent.module.scss
Error evaluating Node.js code
Error: Can't find stylesheet to import.
1 │ @use "variables" as *;
```

Cause / workaround: Next 16 uses the modern Sass API, where the legacy
`includePaths` option is silently ignored. Renaming it to `loadPaths` in
`next.config.ts` fixes it. Worked in Next 15.5.x.
