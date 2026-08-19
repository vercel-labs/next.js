const [t] = await (await fetch("http://127.0.0.1:9229/json/list")).json();
const ws = new WebSocket(t.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const send = (m, p = {}) =>
  new Promise((res, rej) => {
    const i = ++id;
    pending.set(i, { res, rej });
    ws.send(JSON.stringify({ id: i, method: m, params: p }));
  });
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (pending.has(m.id)) {
    const { res, rej } = pending.get(m.id);
    pending.delete(m.id);
    m.error ? rej(m.error) : res(m.result);
  }
};
await new Promise((r) => (ws.onopen = r));
await send("Runtime.enable");
const stat = async () =>
  JSON.parse(
    (
      await send("Runtime.evaluate", {
        expression:
          "(()=>{const h=require('v8').getHeapStatistics();return JSON.stringify({ctx:h.number_of_native_contexts,used:h.used_heap_size,rss:process.memoryUsage().rss})})()",
        returnByValue: true,
        includeCommandLineAPI: true,
      })
    ).result.value
  );

const URL_TARGET = process.env.TARGET_URL || "http://localhost:3000/";
const BATCH = Number(process.env.BATCH || 250);
const BATCHES = Number(process.env.BATCHES || 20);
let total = 0;
await fetch(URL_TARGET, { redirect: "manual" });
await send("HeapProfiler.collectGarbage");
let s = await stat();
console.log(`n=0 ctx=${s.ctx} heapAfterGC=${(s.used / 1048576).toFixed(1)}MB rss=${(s.rss / 1048576).toFixed(0)}MB`);
for (let b = 0; b < BATCHES; b++) {
  for (let i = 0; i < BATCH; i++) await fetch(URL_TARGET, { redirect: "manual" });
  total += BATCH;
  await send("HeapProfiler.collectGarbage");
  s = await stat();
  console.log(`n=${total} ctx=${s.ctx} heapAfterGC=${(s.used / 1048576).toFixed(1)}MB rss=${(s.rss / 1048576).toFixed(0)}MB`);
}
process.exit(0);
