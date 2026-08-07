# Repro for vercel/next.js#50320 — `compress: false` + middleware returns empty page in dev

## Run

```bash
npm install
npm run dev
curl -si http://localhost:3000/
```

## Results observed

| next | dev response for `/` |
| --- | --- |
| 13.4.4 | `HTTP/1.1 200 OK` with `content-length: 0` (empty page) — BUG |
| 15.1.6 (pages + app router) | full HTML |
| 16.3.1-canary.7 (turbopack and `--webpack`) | full HTML |

Change the `next` version in `package.json` to `13.4.4` (with react/react-dom `18.2.0`)
to observe the original empty response.

Files: `next.config.js` (`compress: false`), `middleware.js` (empty middleware with the
documented regex matcher), `pages/index.js`.
