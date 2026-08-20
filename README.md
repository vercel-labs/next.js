# Repro: `setAssetPrefix` has no effect in a custom server (next#71557)

```bash
npm install
npm run build
npm start
curl -s http://localhost:4000/ | grep _next/static           # app router
curl -s http://localhost:4000/pages-route | grep _next/static # pages router
```

Expected: script/CSS URLs are prefixed with `https://example.com/cdn`.
Actual: URLs stay at `/_next/static/...`; the prefix passed to
`app.setAssetPrefix()` after `app.prepare()` is ignored.

Control: building the same app with `assetPrefix: "https://example.com/cdn"` in
`next.config.js` *does* rewrite the URLs, so only the custom-server
`setAssetPrefix()` API is broken.

Verified with next 16.3.1 (both routers ignore the prefix, and Next prints
"The `app.setAssetPrefix()` method is deprecated in custom servers") and with
next 14.2.35, where `app.render()` output ignored the prefix.
