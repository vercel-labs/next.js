# Repro: `reactCompiler: true` breaks styled-jsx className (next.js#65995)

Next.js 16.3.1, react/react-dom 19.2.0, styled-jsx 5.1.7, babel-plugin-react-compiler 1.0.0.
`next.config.mjs` only sets `reactCompiler: true`.

## Run

```bash
npm install
npm run dev            # webpack dev on :3000  (npm run dev:turbo for Turbopack)
```

Open http://localhost:3000/ and look at the browser console.

Optional automated check:

```bash
npm i -D playwright && npx playwright install chromium
node verify.mjs http://localhost:3000
```

## Observed

* SSR HTML: `<div id="theme" class="jsx-c110df8c44e54bb1">` (correct).
* Client render of the same `Theme` client component has **no** className →
  React logs "A tree hydrated but some attributes of the server rendered HTML
  didn't match the client properties" with `- className="jsx-c110df8c44e54bb1"`.
* Navigating `/other` -> `/` (client-side render, no SSR) renders
  `<div id="theme">` with `class = null` and `background-color: rgba(0,0,0,0)`
  i.e. the styled-jsx styles are silently dropped. Same in `next build && next start`.
* Setting `reactCompiler: false` fixes both.
* Reproduces with `--webpack` and `--turbopack`.
