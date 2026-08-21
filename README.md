# Repro: vercel/next.js#94456

Turbopack `next build` fails at prerender with
`Module <id> was instantiated because it was required from module <id>, but the module factory is not available.`

Conditions:
1. `cacheComponents: true`
2. dynamic route with `generateStaticParams` (`app/[locale]/page.tsx`)
3. server component with `'use cache'` (`components/BlockList.tsx`)
4. which renders a `next/dynamic()` `'use client'` module (`components/Block1.tsx`)
5. static generation runs with **more than one worker** (`experimental.cpus: 8` forces this on low-core machines)

## Run

```bash
npm install
npm run build          # next build --turbopack -> FAILS
npm run build:webpack  # next build --webpack   -> succeeds
```

Verified failing on next@16.3.0-canary.40 and next@16.3.1-canary.26; passes with --webpack.
With a single export worker (e.g. 2-core machine, no `experimental.cpus`) the turbopack build passes,
which is why the original report only reproduces on multi-core hosts.
