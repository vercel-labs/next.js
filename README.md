# Repro: `output: 'export'` + webpack emits absolute `/_next/...` font URLs inside CSS (#58234)

Reporter's linked repo (AlejandroSanchez90/call-me-jorge) has no `output: 'export'` and contains
API routes + middleware, so it cannot be exported. This is a minimal reproduction of the reported
workflow: export, rewrite `/_next/` -> `./_next/` in the HTML, host the `out/` folder at a
non-root path, and observe the `@font-face` file 404 while JS/CSS load.

## Steps

```bash
npm install
npx playwright install chromium

# 1) BUG: webpack build -> CSS contains url(/_next/static/media/<font>.woff2) (absolute)
npx next build --webpack
grep -rl '/_next/' out --include=*.html | xargs sed -i 's|"/_next/|"./_next/|g'
node serve-sub.js &            # serves out/ at http://localhost:3001/sub/
node check.js http://localhost:3001/sub/ webpack-subpath
# => 404 http://localhost:3001/_next/static/media/pacifico.*.woff2
# => fontfaces: {"status":["MyPacifico:error"],"check":false}   (fallback font is used)

# 2) OK: default (Turbopack) build -> CSS contains url(../media/<font>.woff2) (relative)
rm -rf .next out && npx next build
grep -rl '/_next/' out --include=*.html | xargs sed -i 's|"/_next/|"./_next/|g'
node check.js http://localhost:3001/sub/ turbopack-subpath
# => 200 .../sub/_next/static/media/pacifico.*.woff2, fontfaces loaded

# 3) assetPrefix: '.' does NOT fix the webpack build
#    CSS becomes url(_next/static/media/...) which resolves relative to the CSS file:
#    404 /sub/_next/static/css/_next/static/media/pacifico.*.woff2
```

`check.js` reports the font requests and `document.fonts` status; `serve-sub.js` is a plain static
file server that mounts `out/` under `/sub/`.
