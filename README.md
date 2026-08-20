# Repro: dynamic `assetPrefix` ignored in `output: 'standalone'` (vercel/next.js#65807)

`next.config.js` sets `assetPrefix: process.env.CDN_URI ?? ''`. `next build` serializes the
resolved config into `.next/standalone/server.js`, so `assetPrefix` is frozen to the build-time
value (`""`). Setting `CDN_URI` when starting the standalone server has no effect, while plain
`next start` (which re-evaluates `next.config.js`) does apply the prefix.

## Run

```bash
npm install
CDN_URI= npx next build      # build WITHOUT the CDN var
bash run.sh                  # builds, boots both servers with CDN_URI set, prints script srcs
```

`run.sh` output on next@16.3.1-canary.25:

```
== serialized assetPrefix baked into standalone server.js:
assetPrefix":""
== standalone (BUG: no prefix):
src="/_next/static/chunks/0knsrj-jxltpj.js"
== next start (expected: prefixed):
src="https://cdn.example.net/_next/static/chunks/0knsrj-jxltpj.js"
```
