# Repro: next 15.5.x fails in StackBlitz WebContainer (vercel/next.js#84026)

Mirror of https://stackblitz.com/edit/nextjs-15-broken-on-webcontainers for issue
https://github.com/vercel/next.js/issues/84026

## Run (must be inside a WebContainer, e.g. StackBlitz/bolt.new)

Open this branch in StackBlitz:
https://stackblitz.com/github/vercel-labs/next.js/tree/repro-issue-84026

Then in the WebContainer terminal:

    npm install && npm run dev

## Observed

Any request to the dev server fails with:

    ⨯ InvariantError: Invariant: Expected workUnitAsyncStorage to have a store. This is a bug in Next.js.

Reproduced with next@15.5.23 (webpack dev) in a StackBlitz WebContainer.
next@15.4.1 works. Running the exact same app on real Node.js (Linux, Node 24) works fine,
so the failure is specific to the WebContainer AsyncLocalStorage/async_hooks implementation.
