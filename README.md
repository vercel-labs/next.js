# PPR / Cache Components: the shell's RSC tree is serialized twice into the HTML

Repro for https://github.com/vercel/next.js/issues/97806 on `next@16.4.0-canary.4`.

With `cacheComponents: true` **and** `partialPrefetching: true`, a PPR route's HTML
contains the whole RSC tree twice: once as the prerendered shell's flight payload and
again inside a second, nested flight stream (rows prefixed `<id>:o<hex>,`) that is
appended after the dynamic hole resolves. The two copies are byte-identical apart from
React reference ids.

## Run

```bash
./repro.sh
```

## Observed (this repo, `/dynamic`)

| `partialPrefetching` | page HTML | inline flight payload | duplicated |
| --- | --- | --- | --- |
| `true`  | 223,394 chars | 146,021 chars / 1085 rows | 500 rows, 53,296 chars (24% of the HTML) |
| `false` | 138,604 chars | 72,986 chars / 543 rows | none |

`analyze.mjs <url>` runs the same measurement against any deployed page.

Notes:
- The duplicate copy starts at a `11e:o1,` row and repeats the layout chrome
  (`components/shell.tsx`: 300 nav links + 300 footer spans) verbatim.
- A fully static route (`/about`, no dynamic hole) shows no duplication in this repro.
