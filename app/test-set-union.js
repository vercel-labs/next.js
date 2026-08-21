'use client'

// Next.js docs claim `core-js/features/set` is injected as a default polyfill,
// but the polyfill bundle is only loaded via `nomodule`, so module-capable
// browsers without native Set.prototype.union (e.g. Chrome 103) throw.
export function TestSetUnion() {
  const set = new Set([1, 2, 3]).union(new Set([1, 2]))
  return <div id="out">Test Set Union {set.size}</div>
}
