// Automated demonstration of the bug.
//
//   1. builds the app and starts `next start` on UPSTREAM_PORT,
//   2. starts the slow-rsc-proxy in front of it on PROXY_PORT (HTTP/1.1, holds the
//      App Router's `_rsc` prefetch responses ~RSC_DELAY_MS to emulate a busy
//      2-core CI runner),
//   3. drives a real Chromium (Playwright) through the same scenario twice:
//        • TREATMENT — prefetch pressure ON: the sidebar/‌pressure prefetch burst
//          keeps all six HTTP/1.1 sockets occupied while a Server Action is clicked.
//        • CONTROL   — prefetch pressure OFF (concurrency 0): stands in for HTTP/2,
//          where there is no 6-connection cap.
//   4. For each run it navigates home → /status (client-side, firing the burst),
//      clicks "Mark ready", and polls the rendered status AND the server truth
//      (GET /api/state, straight to upstream, bypassing the browser pool).
//   5. Prints a PASS / FAIL banner and exits non-zero on FAIL.
//
// The bug: with the pool exhausted, the Server Action's round trip is stalled —
// the click does nothing and the UI stays frozen on the pre-action value for the
// whole time the pool is saturated (unbounded on a real runner → hangs until
// reload). The control, with no pool cap, updates in well under a second.
//
// Tunables (env): RSC_DELAY_MS (default 4000), PROBE_MS (default 2500),
// UPSTREAM_PORT, PROXY_PORT, SKIP_BUILD=1.
import { spawn } from "node:child_process";
import { rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const UPSTREAM_PORT = Number(process.env.UPSTREAM_PORT ?? 4321);
const PROXY_PORT = Number(process.env.PROXY_PORT ?? 4320);
const RSC_DELAY_MS = Number(process.env.RSC_DELAY_MS ?? 4000);
const PROBE_MS = Number(process.env.PROBE_MS ?? 2500); // when to check "did it update yet?"
const SKIP_BUILD = process.env.SKIP_BUILD === "1";
const BASE = `http://127.0.0.1:${PROXY_PORT}`;
const UPSTREAM = `http://127.0.0.1:${UPSTREAM_PORT}`;

const bin = (name) => path.join(ROOT, "node_modules", ".bin", name);
const children = [];

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd: ROOT, stdio: "inherit", ...opts });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
    child.on("error", reject);
  });
}

function background(cmd, args, env = {}) {
  const child = spawn(cmd, args, { cwd: ROOT, stdio: "inherit", env: { ...process.env, ...env } });
  children.push(child);
  return child;
}

async function waitForHttp(url, timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.status < 500) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`timed out waiting for ${url}`);
}

function cleanup() {
  for (const c of children) {
    try {
      c.kill("SIGKILL");
    } catch {
      /* already gone */
    }
  }
}

const serverStatus = async () => (await (await fetch(`${UPSTREAM}/api/state`)).json()).status;

// One pass of the scenario. `pressure` false → control (pool never exhausts).
async function scenario(browser, { pressure }) {
  await rm(path.join(ROOT, ".data"), { recursive: true, force: true }); // reset to "draft"
  const context = await browser.newContext({ viewport: { width: 1000, height: 720 } });
  if (!pressure) await context.addInitScript(() => (window.__PRESSURE_CONCURRENCY__ = 0));
  const page = await context.newPage();

  const aborted = [];
  page.on("requestfailed", (r) => {
    const u = r.url().replace(BASE, "");
    if (!u.startsWith("/_next/static") && r.failure()?.errorText?.includes("ABORTED"))
      aborted.push(`${r.method()} ${u.slice(0, 46)}`);
  });

  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.getByRole("link", { name: /Enter dashboard/ }).click(); // client-side nav → prefetch burst
  await page.getByTestId("status-value").waitFor({ state: "visible", timeout: 30000 });

  const clickAt = Date.now();
  await page.getByTestId("mark-ready").click().catch(() => {});

  let firstUpdateMs = null;
  let uiAtProbe = null;
  let serverAtProbe = null;
  const timeline = [];
  for (let i = 0; i < 24; i++) {
    let ui = "?";
    try {
      if (await page.getByTestId("status-value").count())
        ui = (await page.getByTestId("status-value").first().textContent({ timeout: 1500 }))?.trim();
    } catch {
      /* momentarily detached */
    }
    if (ui === "ready" && firstUpdateMs === null) firstUpdateMs = Date.now() - clickAt;
    const elapsed = Date.now() - clickAt;
    if (uiAtProbe === null && elapsed >= PROBE_MS) {
      uiAtProbe = ui;
      serverAtProbe = await serverStatus();
    }
    timeline.push(ui === "draft" ? "d" : ui === "ready" ? "R" : ".");
    await page.waitForTimeout(250);
  }
  if (uiAtProbe === null) {
    uiAtProbe = timeline.includes("R") ? "ready" : "draft";
    serverAtProbe = await serverStatus();
  }

  await context.close();
  return { firstUpdateMs, uiAtProbe, serverAtProbe, aborted, timeline: timeline.join("") };
}

async function main() {
  await run(bin("playwright"), ["install", "chromium"]); // idempotent

  if (!SKIP_BUILD) {
    console.log("\n[repro] building…");
    await run(bin("next"), ["build"]);
  }

  console.log(`\n[repro] starting next on :${UPSTREAM_PORT} and HTTP/1.1 proxy on :${PROXY_PORT} (holds _rsc ${RSC_DELAY_MS}ms)…`);
  background(bin("next"), ["start", "-p", String(UPSTREAM_PORT)]);
  await waitForHttp(`${UPSTREAM}/`);
  background("node", [path.join(ROOT, "scripts", "slow-rsc-proxy.mjs")], {
    PROXY_PORT: String(PROXY_PORT),
    UPSTREAM_PORT: String(UPSTREAM_PORT),
    RSC_DELAY_MS: String(RSC_DELAY_MS),
  });
  await waitForHttp(`${BASE}/`);

  const browser = await chromium.launch();
  console.log("[repro] CONTROL run (prefetch pressure OFF ≈ HTTP/2)…");
  const control = await scenario(browser, { pressure: false });
  console.log("[repro] TREATMENT run (prefetch pressure ON, HTTP/1.1 pool exhausted)…");
  const treatment = await scenario(browser, { pressure: true });
  await browser.close();
  cleanup();

  // PASS: the control repaints quickly; the treatment is still frozen on the
  // pre-action value at the probe time (a healthy app would be done by then).
  const controlFast = control.firstUpdateMs !== null && control.firstUpdateMs < PROBE_MS;
  const treatmentStalled = treatment.uiAtProbe === "draft";
  const pass = controlFast && treatmentStalled;

  const ms = (v) => (v === null ? "never (within window)" : `${v}ms`);
  console.log("\n════════════════════════════════════════════════════════════");
  console.log(" Server Action under HTTP/1.1 prefetch-pool exhaustion");
  console.log("════════════════════════════════════════════════════════════");
  console.log(` CONTROL   (pool OK ≈ HTTP/2)   UI updated after click : ${ms(control.firstUpdateMs)}`);
  console.log(`                               timeline (250ms/‌step)  : ${control.timeline}`);
  console.log(` TREATMENT (HTTP/1.1 pool full) UI updated after click : ${ms(treatment.firstUpdateMs)}`);
  console.log(`                               timeline (250ms/‌step)  : ${treatment.timeline}`);
  console.log(`                               at ${PROBE_MS}ms → UI="${treatment.uiAtProbe}", server="${treatment.serverAtProbe}"`);
  if (treatment.aborted.length)
    console.log(`                               aborted RSC requests   : ${treatment.aborted.length} (e.g. ${treatment.aborted[0]})`);
  console.log("  legend: d = UI shows \"draft\" (pre-action)   R = UI shows \"ready\"   . = transient");
  console.log("════════════════════════════════════════════════════════════");
  if (pass) {
    console.log(" PASS ✅  BUG REPRODUCED");
    console.log(`          Same app, same click: the control repainted in ${ms(control.firstUpdateMs)},`);
    console.log(`          but under HTTP/1.1 pool exhaustion the Server Action was still`);
    console.log(`          frozen on "draft" ${PROBE_MS}ms later. On a real runner (pool never`);
    console.log(`          drains) this is the "action hangs / UI never updates" report.`);
  } else {
    console.log(" FAIL ❌  Not reproduced this run.");
    console.log(`          control.firstUpdate=${ms(control.firstUpdateMs)} treatment.uiAt${PROBE_MS}ms=${treatment.uiAtProbe}`);
    console.log("          Try a larger RSC_DELAY_MS.");
  }
  console.log("════════════════════════════════════════════════════════════\n");
  process.exit(pass ? 0 : 1);
}

process.on("SIGINT", () => {
  cleanup();
  process.exit(130);
});

main().catch((err) => {
  console.error("\n[repro] error:", err.message);
  cleanup();
  process.exit(1);
});
