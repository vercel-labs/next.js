# next#86048 — App Router routes 404 when Pages Router `i18n` config is present

Mirror of https://github.com/RobVermeer/nextjs-i18n-domain-routing-issue for issue
https://github.com/vercel/next.js/issues/86048 (Next.js 16.0.1).

## Run

```bash
npm install
npm run dev
# no /etc/hosts edit needed, use Host header:
curl -i -H 'Host: nl.example.local:3000' http://127.0.0.1:3000/         # 200, Pages Router, locale nl-NL
curl -i -H 'Host: nl.example.local:3000' http://127.0.0.1:3000/test     # 404 (App Router, expected 200)
curl -i -H 'Host: nl.example.local:3000' http://127.0.0.1:3000/nl-NL/test # 404 too
```

Removing `i18n` from `next.config.ts` makes both `/test` and `/nl-NL/test` return 200.
`i18n` without `domains` also 404s, so `domains` is not required to trigger it.

`npm run build` fails with:
`Error: The provided export path '/test' doesn't match the '/[lang]/test' page.` (export-path-mismatch)
