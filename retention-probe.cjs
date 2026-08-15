// What fraction of abort-reason Errors stay REACHABLE after the request that created them is done?
//
// Creation rate is not the differentiator: a trivial Cache Components app constructs these at a
// similar per-render rate and leaks nothing. The difference is how many survive a GC.
//
// Measuring that from heap snapshots costs minutes per iteration. This does it in-process: hold a
// WeakRef to a sample of abort reasons, force GC, count survivors.
// WeakRefs do not retain, so the probe cannot create the effect it measures.
//
// Load with:  node --expose-gc --require ./retention-probe.cjs ...
// Read with:  curl -s localhost:<PORT>/... then kill -USR2 <pid>; cat $RETENTION_OUT
//
// Env: RETENTION_OUT (default ./retention.txt), RETENTION_SAMPLE (default 20)

const fs = require('node:fs');

const OUT = process.env.RETENTION_OUT ?? 'retention.txt';
const SAMPLE_EVERY = Number(process.env.RETENTION_SAMPLE ?? 20);
const MAX_REFS = Number(process.env.RETENTION_MAX ?? 20000);

const refs = [];
let seen = 0;
let sampled = 0;

const origAbort = AbortController.prototype.abort;

AbortController.prototype.abort = function abort(reason) {
  try {
    if (reason instanceof Error) {
      seen++;
      if (seen % SAMPLE_EVERY === 0 && refs.length < MAX_REFS) {
        refs.push(new WeakRef(reason));
        sampled++;
      }
    }
  } catch {
    /* never break the request path */
  }
  return origAbort.call(this, reason);
};

function measure() {
  if (typeof global.gc !== 'function') {
    fs.writeFileSync(OUT, 'ERROR: run node with --expose-gc\n');
    return;
  }
  // Two passes: one leaves floating garbage that the second collects.
  global.gc();
  global.gc();

  let alive = 0;
  for (const r of refs) if (r.deref() !== undefined) alive++;

  const pct = sampled ? ((alive / sampled) * 100).toFixed(1) : '0.0';
  // Bytes actually held after a full GC. The count above is a proxy; this is what OOMs the process.
  const heapMB = (process.memoryUsage().heapUsed / 1048576).toFixed(1);
  const out = [
    `abort Errors seen      : ${seen}`,
    `sampled (1 in ${SAMPLE_EVERY})   : ${sampled}`,
    `still reachable post-GC: ${alive}`,
    `RETENTION RATE         : ${pct}%`,
    `heapUsedMB post-GC     : ${heapMB}`,
    '',
    'Compare arms by retained-per-render, not by this percentage: the rate is confounded by',
    'however many Errors were still in flight when the measurement ran.',
  ].join('\n');

  fs.writeFileSync(OUT, out + '\n');
  console.log(`[retention-probe] ${pct}% (${alive}/${sampled})`);
}

process.on('SIGUSR2', measure);
process.on('exit', measure);

console.log('[retention-probe] installed');
