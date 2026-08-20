# next.js#59330 reproduction — remote CSS `@import` from a nested file is dropped

`styles/globals.css` imports `tailwindcss` and then `styles/fonts.css`.
`styles/fonts.css` starts with a remote `@import url('https://fonts.googleapis.com/...')`.

## Run

```bash
npm install
npm run build && npm start   # http://localhost:3000
```

## Observed (Next.js 16.3.1-canary.25, both Turbopack and `--webpack`)

Build prints:

```
Found 1 warning while optimizing generated CSS:
@import url('https://fonts.googleapis.com/css2?family=Rubik+Dirt&display=swap');
       ^-- @import rules must precede all rules aside from @charset and @layer statements
```

and the remote `@import` is **removed entirely** from `.next/static/**/*.css`,
so the webfont is never requested and `.remote-font` falls back to system-ui.
`npm run dev` keeps the `@import` in the served css, but the browser ignores it
for the same reason (it is not at the top of the stylesheet).

Expected: the remote `@import` is hoisted to the top of the generated stylesheet
(or emitted as a `<link>`), as requested in the issue.
