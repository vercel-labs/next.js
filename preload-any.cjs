// Instruments AbortSignal.any — the call the prod snapshot fingerprinted as the
// anchor (1,546 composites pinned in Node's gcPersistentSignals, one per render).
// Records per-call-site counts and, via WeakRef, how many composites are STILL
// alive later. A composite that never dies is the leak.
const origAny = AbortSignal.any.bind(AbortSignal);
const counts = new Map();
const refs = [];

AbortSignal.any = function any(signals) {
  const site = (new Error().stack || "")
    .split("\n").slice(2, 5).map((l) => l.trim().replace(/^at\s+/, ""))
    .filter((l) => !l.includes("node:internal")).slice(0, 2).join("  <-  ");
  counts.set(site, (counts.get(site) || 0) + 1);
  const c = origAny(signals);
  refs.push(new WeakRef(c));
  return c;
};

globalThis.__anyStats = () => {
  let alive = 0;
  for (const r of refs) if (r.deref()) alive++;
  return {
    calls: [...counts.values()].reduce((a, b) => a + b, 0),
    created: refs.length,
    stillAlive: alive,
    sites: [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8),
  };
};
