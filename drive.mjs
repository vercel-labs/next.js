// Drives the reproduction end to end:
//   1. starts the standalone server with AbortSignal.any instrumented (preload-any.cjs),
//   2. crawls distinct /p/<slug> URLs in rounds,
//   3. after each round forces 3 full GCs over CDP and reports how many composite
//      AbortSignals created by Next's `use cache` wrapper are still alive.
//
// A composite is only built when a request triggers a *runtime fallback-shell
// prerender* (outer work unit store type `prerender`), so a handful of rounds is
// needed before the first one appears. Every one that is created stays alive.
import { spawn } from "node:child_process";

const ROUNDS = Number(process.env.ROUNDS || 6);
const PER_ROUND = Number(process.env.PER_ROUND || 30);
const CDP = "http://127.0.0.1:9231";

const server = spawn(
  process.execPath,
  ["--expose-gc", "--inspect=127.0.0.1:9231", "--require", "./preload-any.cjs", ".next/standalone/server.js"],
  { stdio: ["ignore", "inherit", "inherit"] }
);
process.on("exit", () => server.kill());

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
for (let i = 0; i < 60; i++) {
  try { await fetch("http://localhost:3000/"); break; } catch { await sleep(500); }
}

async function stats() {
  const t = (await (await fetch(`${CDP}/json/list`)).json()).find((x) => x.webSocketDebuggerUrl);
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r, { once: true }));
  let id = 1; const pending = new Map();
  ws.addEventListener("message", (e) => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m.result); pending.delete(m.id); } });
  const send = (method, params = {}) => new Promise((res) => { const i = id++; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  await send("Runtime.enable"); await send("HeapProfiler.enable");
  for (let i = 0; i < 3; i++) await send("HeapProfiler.collectGarbage");
  const r = await send("Runtime.evaluate", { expression: "JSON.stringify(globalThis.__anyStats())", returnByValue: true });
  ws.close();
  return JSON.parse(r.result.value);
}

for (let round = 1; round <= ROUNDS; round++) {
  for (let i = 1; i <= PER_ROUND; i++) {
    await fetch(`http://localhost:3000/p/round${round}-${i}`).then((r) => r.text());
  }
  await sleep(3000);
  const s = await stats();
  const mem = await (await fetch("http://localhost:3000/api/mem?gc=1")).json();
  console.log(
    `round ${round}: composites created ${s.created}, STILL ALIVE after 3 forced GCs ${s.stillAlive} | ` +
      `live AbortSignals ${mem.abortSignals}, arrayBuffers ${mem.arrayBuffersMB} MB, rss ${mem.rssMB} MB`
  );
}
console.log("\nExpected on an unpatched Next 16.3.0: STILL ALIVE === created (100% retained).");
console.log("With the listener detached after the render (npm run repro:with-detach-fix): STILL ALIVE 0.");
server.kill();
process.exit(0);
