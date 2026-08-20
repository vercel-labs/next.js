# Repro: `Props must be serializable for components in "use client" entry file` — ts(71007)

Issue: https://github.com/vercel/next.js/issues/74343

The Next.js TypeScript plugin reports ts(71007) on **every** `"use client"` module whose
component accepts a function prop, even when that module is never imported by a Server
Component (here `components/child.tsx` is only rendered by `components/chat.tsx`, also
`"use client"`). The warning cannot be suppressed with `@ts-ignore` / eslint comments.

## Run

```bash
npm install
npm run diagnostics
```

`scripts/ts-plugin-diagnostics.mjs` drives `tsserver` with the plugin exactly like an editor
does and prints its semantic diagnostics (no editor needed).

### Expected output (Next 16.3.1)

```
=== components/child.tsx ===
  line 6:57 [warning] ts(71007) Props must be serializable for components in the "use client" entry file. "resumeStream" is a function that's not a Server Action. Rename "resumeStream" either to "action" or have its name end with "Action" e.g. "resumeStreamAction" to indicate it is a Server Action.

=== components/chat.tsx ===
  (no diagnostics)
```

`components/child-ts-ignore.tsx` shows the same warning is still emitted with `@ts-ignore`
and `eslint-disable-next-line` present.

`npm run build` succeeds, so the warning is editor-only noise.
