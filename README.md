# Repro: issue #82574 — "NextRouter was not mounted" when `next build` runs with NODE_ENV=development

    npm install
    NODE_ENV=development npx next build   # fails: NextRouter was not mounted
    npx next build                        # succeeds

Next.js 16.3.1, pages router, `useRouter()` in a statically prerendered page.
