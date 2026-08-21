# Turbopack panic: `Next.js package not found` (vercel/next.js#92534)

Minimal reproduction for a Turbopack `FATAL` panic whose root cause is
`try_get_next_package` failing while `next` is perfectly resolvable by Node.

The reporter's linked repo (`mirraman/turbopack-panic-repro`) has **no**
`app/dashboard/page.tsx` (a stray `page.tsx` sits at the repo root), so
`/dashboard` only 404s there. This repo adds the missing route and adds a
deterministic trigger for the panic on any OS.

## Run

```bash
pnpm install
pnpm dev            # baseline: /dashboard renders fine (no panic on Linux)
bash repro.sh       # panics
```

`repro.sh` moves `node_modules/.pnpm` outside the project (a symlink layout
comparable to pnpm junctions / stores outside the inferred Turbopack root on
Windows) and starts `next dev`:

```
FATAL: An unexpected Turbopack error occurred. A panic log has been written ...
Error [TurbopackInternalError]: Symlink [project]/node_modules/next is invalid, it points out of the filesystem root
- Execution of directory_tree_to_loader_tree failed
- Execution of try_get_next_package failed
- Execution of find_package failed
```

while `node -e "console.log(require.resolve('next/package.json'))"` still
resolves, matching the report. `next dev --webpack` works, because only
Turbopack confines resolution to the project root
(`crates/next-core/src/next_import_map.rs`, `try_get_next_package` /
`get_next_package(...).context("Next.js package not found")`).

Versions: next 16.2.0, react/react-dom 19.2.4.
