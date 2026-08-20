# Reproduction: issue #60273

`app/pages/[id]/page.tsx` with `export const runtime = 'edge'` (in `app/layout.tsx`)
returns HTTP 500 (`ReferenceError: self is not defined`) when deployed to Vercel,
while `next build && next start` locally returns 200.

## Steps

```bash
npm install --legacy-peer-deps
npx next build && npx next start   # http://localhost:3000/pages/1 -> 200 OK
```

Then deploy the same directory to Vercel and open `/pages/1` -> 500.

## Results observed

| next | local `next start` /pages/1 | Vercel /pages/1 |
| --- | --- | --- |
| 14.2.15 (pinned here) | 200 | **500** |
| 16.3.1-canary.25 | 200 | 200 |
