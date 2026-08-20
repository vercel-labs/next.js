# Repro: next.js#46622 — i18n config breaks generateStaticParams export paths

Run:

```
npm install
npm run build
```

Observed (Next.js 16.3.1-canary.25):

```
Error: The provided export path '/blog/test-1' doesn't match the '/[lang]/blog/[slug]' page.
Export encountered an error on /[lang]/blog/[slug]/page: /en/blog/test-1, exiting the build.
```

Removing the `i18n` block from `next.config.js` makes the build succeed.
