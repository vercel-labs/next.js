// Drives the cache-poisoning sequence against `next start`.
// Run: npm install && npm run build && node repro.mjs
import { spawn } from "node:child_process";
import { writeFileSync } from "node:fs";

const PORT = 3100;
const BASE = `http://localhost:${PORT}`;

writeFileSync("db.json", JSON.stringify({ "1": { id: "1", name: "Bulbasaur" } }));

const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
  stdio: ["ignore", "inherit", "inherit"],
});
process.on("exit", () => server.kill());

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      await fetch(`${BASE}/api/db?op=add&id=1`);
      return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error("server did not start");
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`);
  const html = await res.text();
  return { status: res.status, found: html.includes('<h1 id="name"') };
}

const mutate = (op) => fetch(`${BASE}/api/db?op=${op}&id=1`);

async function scenario(route, label) {
  console.log(`\n=== ${route}  (${label})`);
  const a = await get(`${route}/1`);
  console.log(`1. GET ${route}/1 while Bulbasaur exists  -> ${a.found ? "OK" : "not-found"}`);
  await mutate("del");
  const b = await get(`${route}/1`);
  console.log(`2. delete + revalidateTag, GET again      -> ${b.found ? "OK" : "not-found (expected)"}`);
  await mutate("add");
  const c = await get(`${route}/1`);
  const d = await get(`${route}/1`);
  console.log(`3. restore + revalidateTag, GET again     -> ${c.found ? "OK" : "not-found  <-- POISONED"}`);
  console.log(`4. GET once more                          -> ${d.found ? "OK" : "not-found  <-- POISONED"}`);
  return a.found && !b.found && !c.found && !d.found;
}

await waitForServer();
const poisoned = await scenario("/p", "cacheTag() called after the data lookup, like the issue report");
const control = await scenario("/q", "control: cacheTag() called before the data lookup");

console.log(
  `\nRESULT: ${poisoned ? "REPRODUCED" : "not reproduced"} on /p — the notFound() outcome stays cached forever` +
    `\n        control /q recovered after revalidateTag: ${control ? "NO" : "yes"}`
);
server.kill();
