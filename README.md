# Repro: next.js#74940 — parallel route slot loses its own `loading.tsx` on nested child routes

    npm install
    npm run dev
    # then: curl -s http://localhost:3000/parent/sub | grep -o 'Loading [A-Za-z]*\.\.\.'

Route tree: `app/parent/{layout,loading,page}.tsx`, `app/parent/sub/{loading,page}.tsx`,
`app/parent/@slot/{loading,page,default}.tsx`.

- `/parent` streams `Loading Slot...` + `Loading Parent...` (correct).
- `/parent/sub` streams `Loading Sub...` + `Loading Parent...`, i.e. the `@slot`
  segment (rendering `@slot/default.tsx`) falls back to the parent `loading.tsx`
  instead of `@slot/loading.tsx`. Expected: `Loading Slot...`.
