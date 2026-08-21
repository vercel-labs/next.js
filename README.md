# Repro: custom `pageExtensions` breaks `instrumentation` (vercel/next.js#92342)

`next.config.ts` sets `pageExtensions: ['tsx','ts','universal.ts','universal.tsx']`
and the instrumentation hook is named `src/instrumentation.universal.ts`.

## Run

```bash
npm install

# A) no proxy file -> register() is NEVER called
npm run build && node .next/standalone/server.js

# B) with proxy.universal.ts -> register() IS called, but reports NEXT_RUNTIME=edge
cp src/proxy.universal.ts.disabled src/proxy.universal.ts
rm -rf .next && npm run build && node .next/standalone/server.js

# C) rename src/instrumentation.universal.ts -> src/instrumentation.ts
#    -> register() called with NEXT_RUNTIME=nodejs (correct)
```

Expected in all cases: `register()` runs once with `NEXT_RUNTIME=nodejs`.
