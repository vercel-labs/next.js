# Repro: non-deterministic `next build` output (vercel/next.js#63201)

Minimal app-router app with `output: 'export'`, 60 global CSS files and 60 CSS
modules spread over 6 routes. `next.config.js` pins `generateBuildId` so that the
random build id does not hide the real differences.

```bash
node generate.js
npm install
./test.sh 20   # builds twice per attempt, 20 attempts, stops on the first diff
```

Each attempt does: clean build -> `out_back`, clean build -> `out`, `diff -r`.

## Observed (Node 24, linux x64, 2 cores)

| next | build | result |
| --- | --- | --- |
| 14.2.35 (pinned here) | webpack | intermittent: 1 diff in ~20 attempts, e.g. `Only in out_back/.../app/p2: page-32dd62a8a482af09.js` vs `Only in out/.../app/p2: page-9dac64c3814c5dd1.js`. Only the webpack module id of one CSS-module import changes (`o.t.bind(o,7255,23)` vs `o.t.bind(o,7301,23)`), which cascades into the chunk content hash. |
| 15.3.9 | webpack | every attempt differs: all prerendered `*.html`/`*.txt` contain a different random 22-char base64url value in the flight payload (`["$","$1","7EB3fKgQyI7N4mzyaAgOFv",...]`), even with a fixed build id |
| 15.5.23 | webpack | 4/4 attempts identical |
| 16.3.1 | webpack (`next build --webpack`) | 15/15 attempts identical |
| 16.3.1 | turbopack (default) | 8/8 attempts identical |

Switch versions with e.g.
`npm i next@15.3.9 react@19.1.0 react-dom@19.1.0 && ./test.sh 4`.
