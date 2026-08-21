# Repro: form field hydration glitch (vercel/next.js#85782)

Mirror of https://github.com/TrevorBurnham/next-turbopack-form-glitch-repro with a deterministic
Playwright harness so the glitch can be observed without manual typing.

```bash
npm install
npx playwright install chromium --with-deps
npm run build            # Turbopack (default). Add --webpack to compare.
npm start &
node verify-hydration-glitch.mjs http://localhost:3000/app-router-test '#app-test-input'  # App Router
node verify-hydration-glitch.mjs http://localhost:3000/ '#test-input'                     # Pages Router
```

The harness applies 400ms network latency via CDP, types into the server-rendered `<input>`
before hydration, then reads the value after `Hydration complete!`. Exit code 1 = input wiped.

Observed on next@16.0.2-canary.6, react/react-dom 19.2.0, both routers:
typed `hello-before-hydration` -> `""` after hydration, with no console error.
Same result with `next build --webpack` at this latency.
