# Repro: `draftMode()` inside `generateStaticParams` (issue #58733)

`app/blog/[slug]/page.js` calls `draftMode()` from a helper used by `generateStaticParams`.

```
npm install && npm run build
```

- next@15.1.0: `Error: \`draftMode\` was called outside a request scope. ...` (no mention of generateStaticParams)
- next@16.3.1: `Error: Route /blog/[slug] used \`draftMode()\` inside \`generateStaticParams\`. This is not supported because \`generateStaticParams\` runs at build time without an HTTP request.` + code frame

So the requested error-message improvement has landed; the build still fails (by design) but the message is now actionable.
