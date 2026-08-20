# Repro: vercel/next.js#48058 — app router params are not URL-decoded

Next.js version tested: 16.3.1-canary.25

```
npm install
npm run dev
curl 'http://localhost:3000/status/java/play.hypixel.net%3A25565'
```

Expected: `params.address === "play.hypixel.net:25565"`
Actual: `params.address === "play.hypixel.net%3A25565"` (also `%40`, `%20` stay encoded)
