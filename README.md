# Repro: issue #84402 — `&` in image/link URLs is emitted as `&amp;` in SSR HTML

Next.js 15.6.0-canary.38, React 19.1.1.

```
npm install
npm run dev   # then: curl -s http://localhost:3000/ | grep -o '\(src\|href\)="[^"]*picsum[^"]*"'
# also: npm run build && npm start
```

Output (dev and next start, identical):
`src="https://picsum.photos/id/870/200/300?grayscale=1&amp;blur=2"` for next/image, plain `<img>`,
`<link rel=preload>` and `<a href>`.

This is standard HTML attribute escaping performed by React DOM's SSR renderer (`escapeTextForBrowser`),
not a Next.js URL mangling: a spec-compliant parser resolves `img.src` back to `...?grayscale=1&blur=2`
and Chromium requests the correct URL (verified with Playwright).

The one place where a naive consumer can genuinely break: content inside `<noscript>` is parsed as
raw text when scripting is enabled, so `textContent` keeps the literal `&amp;`; crawlers that
regex-scrape `noscript` markup without HTML-entity decoding will fetch `...?grayscale=1&amp;blur=2`.
