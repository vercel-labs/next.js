# Repro for vercel/next.js#60328 — server action mutates a duplicated module instance (webpack bundler)

Client component imports a server action directly. The action mutates a module-level array in
`app/lib/data.ts` and calls `revalidatePath('/')`. The page (server component) reads the same module.

With the **webpack** bundler, the action and the page get **separate instances** of `app/lib/data.ts`
(action-browser layer vs. rsc layer), so the array the action mutates is not the array the page renders.

## Run

```bash
npm install
npm run dev            # next dev --webpack
node verify.mjs        # clicks "Add Item" 3x and prints the rendered length
```

Bug: `Array length` on the page stays `2` forever while the server log prints
`createItem: array length 2 -> 3 -> 4 -> 5` and `fetchItems: array length 2`.

Also reproduces in production: `npm run build && npm run start` then `node verify.mjs`.

Does **not** reproduce with Turbopack (`npm run dev:turbopack`), and disappears if any server
component imports/executes something from `app/lib/actions.ts` (uncomment `<Nop />` in `app/page.tsx`).

Verified with next@16.3.1-canary.25 (and next@15.2.1 where webpack was the dev default).
