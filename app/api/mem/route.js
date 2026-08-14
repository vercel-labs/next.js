import v8 from "node:v8";
export async function GET(request) {
  const url = new URL(request.url);
  if (url.searchParams.get("gc") && global.gc) { global.gc(); global.gc(); global.gc(); }
  if (url.searchParams.get("drop")) { globalThis.__KEPT_SIGNALS__ = []; if (global.gc) { global.gc(); global.gc(); global.gc(); } }
  const m = process.memoryUsage();
  const mb = (n) => +(n / 1048576).toFixed(1);
  const count = (ctor) => { try { return v8.queryObjects(ctor, { format: "count" }); } catch { return -1; } };
  return Response.json({
    keptSignals: (globalThis.__KEPT_SIGNALS__ || []).length,
    rssMB: mb(m.rss), heapUsedMB: mb(m.heapUsed), externalMB: mb(m.external), arrayBuffersMB: mb(m.arrayBuffers),
    errors: count(Error), abortSignals: count(AbortSignal), fix: process.env.NEXT_ABORT_FIX === '1',
  });
}
