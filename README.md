# Repro harness for vercel/next.js#42582 — "Script blocks hydration/interactivity when using suspense streaming"

App Router app with three routes that each stream a 5s Suspense boundary next to a
client component button (`#click`):

- `/with-script` – `next/script` `afterInteractive`, local `/slow-script.js`
- `/with-cdn-script` – `next/script` `afterInteractive`, `https://code.jquery.com/jquery-3.6.1.min.js` (same as the original report)
- `/without-script` – control, no `next/script`

`measure.mjs` / `measure-throttle.mjs` (Playwright) navigate with `waitUntil: 'commit'`,
then poll-click the button until its state updates, recording the time the page became
interactive vs. the time the Suspense boundary resolved.

## Run

```bash
npm install
npm run build && npm start           # http://localhost:3000
node measure.mjs http://localhost:3000/with-script with-script
node measure.mjs http://localhost:3000/without-script without-script
node measure-throttle.mjs <deployed-url>/with-cdn-script throttled   # HTTP/2 + 4x CPU / 1.6Mbps
```

## Result (next@16.3.1-canary.25, headless Chromium 151)

| target | interactive | suspense resolved |
| --- | --- | --- |
| local `next start` `/with-script` | 189 ms | 5022 ms |
| local `next start` `/without-script` | 169 ms | 5087 ms |
| Vercel (HTTP/2) `/with-script` | 363 ms | 5169 ms |
| Vercel (HTTP/2) `/with-cdn-script` | 598 ms | 5411 ms |
| Vercel (HTTP/2) `/without-script` | 858 ms | 5777 ms |
| Vercel throttled `/with-cdn-script` | 1677 ms | 5247 ms |
| Vercel throttled `/without-script` | 1319 ms | 5083 ms |

The page hydrates and the button counter increments long before streaming completes in
every variant, i.e. the reported blocking behaviour does not reproduce.

The reporter's original repo (`capJavert/nextjs-script-blocks-streaming`, lockfile pins
`next@13.0.3-canary.0`) was also run as-is: interactive at 147 ms locally and 372 ms when
deployed to Vercel over HTTP/2, while the lazy content only appeared at ~3.3 s.
