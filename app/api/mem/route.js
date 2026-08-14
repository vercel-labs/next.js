import v8 from "node:v8";

// Reports memory plus the live population of the objects the leak hypothesis
// says accumulate. `?gc=1` forces a full GC first (needs --expose-gc), and
// v8.queryObjects itself also collects, so these are live counts.
export async function GET(request) {
  const url = new URL(request.url);
  if (url.searchParams.get("gc") && global.gc) {
    global.gc();
    global.gc();
  }
  const m = process.memoryUsage();
  const mb = (n) => Math.round(n / 1048576);
  const count = (ctor) => {
    try {
      return v8.queryObjects(ctor, { format: "count" });
    } catch {
      return -1;
    }
  };
  return Response.json({
    rssMB: mb(m.rss),
    heapUsedMB: mb(m.heapUsed),
    arrayBuffersMB: mb(m.arrayBuffers),
    errors: count(Error),
    abortSignals: count(AbortSignal),
    arrayBuffers: count(ArrayBuffer),
  });
}
