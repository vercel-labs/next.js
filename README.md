# Repro for vercel/next.js#57415 — nonce not applied to `<style>` for CSS Modules

Next.js `16.3.1-canary.25`, App Router, `middleware.js` sets a `Content-Security-Policy`
with `style-src 'self' 'nonce-...'` and forwards the nonce on the request headers.

## Run

```bash
npm install
npx playwright install chromium

# A) default (CSS emitted as <link rel="stylesheet">) -> WORKS
npm run build && npm run start
node check.js http://localhost:3001/ linked
# -> <link ... nonce="..."> present, h1 computed color rgb(102, 51, 153), 0 CSP errors

# B) experimental.inlineCss (CSS inlined into <style>) -> BROKEN
npm run build:inline && npm run start:inline
node check.js http://localhost:3001/ inlined
# -> <style data-precedence="next"> has NO nonce attribute,
#    browser: "Applying inline style violates the following Content Security Policy
#    directive 'style-src 'self' 'nonce-...'" and h1 renders unstyled (rgb(0,0,0), 32px)
```

The 12 injected `<script>` tags in case B all carry the nonce; only the CSS `<style>` tag does not.

Dev mode (`npm run dev`) no longer reproduces the original report: the CSS Module is served
as a nonce'd `<link>` and the styles apply. Remaining CSP violations in dev come from the
Next.js dev overlay's own inline styles.
