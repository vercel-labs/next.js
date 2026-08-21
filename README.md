# Repro: vercel/next.js#85680 — inconsistent `@next/codemod` dist-tags in docs

Docs mix `npx @next/codemod@canary <transform>` and `npx @next/codemod@latest <transform>`,
sometimes for the *same* codemod (e.g. `middleware-to-proxy`, `next-async-request-api`).
Per maintainer feedback, `@canary` is the intended tag, so every `@latest` occurrence is the bug.

## Run

```bash
./scan-docs.sh          # audit the tags used across docs/ + errors/ on canary
./run-codemod.sh        # shows @latest also resolves/works (reporter's claim)
```

`scan-docs.sh` does a sparse shallow clone of vercel/next.js and prints all
`@next/codemod@<tag>` occurrences grouped by tag, plus codemods documented with both tags.
