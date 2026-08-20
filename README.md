# Repro: browser `error.stack` is not source-mapped (next.js#32359)

Next.js 16.3.1, pages router, TypeScript.

- `lib/boom.ts` throws on line 3.
- `pages/index.tsx` catches it in `useEffect` and `console.log`s `err.stack`.
- `pages/uncaught.tsx` throws during render (uncaught).

## Run

```bash
npm install
npx playwright install chromium
npm run dev            # terminal 1
npm test               # terminal 2 - prints browser console output
```

## Observed (dev, Turbopack)

```
Error: kaboom from lib/boom.ts line 3
    at boom (http://localhost:3000/_next/static/chunks/%5Broot-of-the-server%5D__0qynixt._.js:35:11)
    at Home.useEffect (.../%5Broot-of-the-server%5D__0qynixt._.js:60:133)
```

Expected `lib/boom.ts:3` / `pages/index.tsx:7`. The served `.map` for that chunk does
map 35:11 -> `lib/boom.ts:3:9` and 60:133 -> `pages/index.tsx:7:11`, so the source map is
correct but the `error.stack` string handed to user code / logged to the console is raw.
