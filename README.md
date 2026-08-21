# Reproduction for vercel/next.js#85604

Passing `next/link` (a client component) from a Server Component as a prop to
another Client Component fails during prerender in Next.js >= 16.0.1.

## Run

```bash
npm install
npm run build
```

## Observed (next 16.0.1 and 16.3.1)

```
Error occurred prerendering page "/".
Error: Functions cannot be passed directly to Client Components unless you explicitly expose it by marking it with "use server". Or maybe you meant to call this function rather than return it.
  {linkComponent: function i}
                  ^^^^^^^^^^
Export encountered an error on /page: /, exiting the build.
```

## Expected

Build succeeds, as it does with `next@15.5.7` (verified).

Files:
- `app/page.tsx` — Server Component, `<Header linkComponent={Link} />`
- `app/components/Header.tsx` — `'use client'` component rendering the passed component
