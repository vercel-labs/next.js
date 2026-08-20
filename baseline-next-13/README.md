# Baseline: Next.js 13.2.4 (version where the issue was reported)

```bash
mkdir baseline && cd baseline && npm init -y
npm i next@13.2.4 react@18.2.0 react-dom@18.2.0
mkdir pages && cp ../baseline-next-13/index.js pages/index.js
# IMPORTANT: remove "type": "module" from package.json if npm added it
npx next dev -p 3122
# then, from the parent repro folder:
BASE=http://localhost:3122 node baseline-axe-check.mjs
```

axe-core 4.13 on that server reports, inside the error overlay:
- `button-name`: `<button type="button" disabled aria-disabled="true">` and the icon-only next button
- `heading-order`: `<h5>Source</h5>` directly after `<h1>Unhandled Runtime Error</h1>`
- `tabindex`: `<p role="link" tabindex="1" title="Click to open in your editor">`
