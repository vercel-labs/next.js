#!/usr/bin/env node
/**
 * Reproduction driver for the `"use cache"` halted-stream cache poisoning bug.
 *
 * The experiment is an A/B on a single route, `/slow`, which reaches a shared
 * `"use cache"` entry only after some uncached async work:
 *
 *   CONTROL   cold server -> ordinary GET /slow          -> entry fills correctly
 *   POISON    cold server -> runtime-prefetch GET /slow  -> entry is stored truncated
 *
 * After each run we read that same entry from two *other* routes
 * (`/late-reader` and `/b`). In the control run they render. After the
 * runtime-prefetch run they fail, permanently, with `Error: Connection closed.`
 *
 * Usage: node scripts/reproduce.mjs [--rounds=5] [--port=4300] [--skip-build]
 */

import { spawn } from "node:child_process";
import { appendFile, mkdir, readFile, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));

const args = new Map(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? "true"];
  }),
);

const PORT = Number(args.get("port") ?? 4300);
const ROUNDS = Number(args.get("rounds") ?? 5);
const SKIP_BUILD = args.get("skip-build") === "true";
const BASE = `http://127.0.0.1:${PORT}`;
const LOG_DIR = join(ROOT, ".repro");

/** How long the cache fill itself takes (stand-in for a slow database read). */
const FILL_DELAY_MS = 800;
/**
 * How much uncached async work happens before the cached function is reached.
 * It must exceed FILL_DELAY_MS so that the runtime prerender has already
 * concluded "all caches are filled" -- and aborted its render signal -- by the
 * time this read starts.
 */
const PRE_READ_DELAY_MS = 2500;
/** Long enough for the detached, already-aborted fill to be written. */
const SETTLE_MS = PRE_READ_DELAY_MS + FILL_DELAY_MS + 700;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const count = (haystack, needle) => haystack.split(needle).length - 1;

function build() {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["next", "build"], {
      cwd: ROOT,
      stdio: "inherit",
      env: { ...process.env, NODE_ENV: "production" },
    });
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0 ? resolve() : reject(new Error(`next build exited ${code}`)),
    );
  });
}

async function startServer(logFile) {
  const server = spawn("npx", ["next", "start", "-p", String(PORT)], {
    cwd: ROOT,
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      NODE_ENV: "production",
      NEXT_PRIVATE_DEBUG_CACHE: "1",
      REPRO_FILL_DELAY_MS: String(FILL_DELAY_MS),
      REPRO_PRE_READ_DELAY_MS: String(PRE_READ_DELAY_MS),
    },
  });
  const onData = (buf) => void appendFile(logFile, buf).catch(() => {});
  server.stdout.on("data", onData);
  server.stderr.on("data", onData);

  for (let i = 0; i < 160; i++) {
    try {
      const res = await fetch(`${BASE}/`);
      if (res.ok) {
        await res.text();
        return server;
      }
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  server.kill("SIGKILL");
  throw new Error("server did not become ready");
}

function stopServer(server) {
  return new Promise((resolve) => {
    if (!server || server.exitCode !== null) return resolve();
    server.once("exit", () => resolve());
    try { process.kill(-server.pid, "SIGTERM"); } catch {}
    setTimeout(() => {
      try { process.kill(-server.pid, "SIGKILL"); } catch {}
      resolve();
    }, 4000);
  });
}

/** Read a route and report whether the shared cache entry decoded cleanly. */
async function probe(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: "follow" });
  const body = await res.text();
  return {
    path,
    status: res.status,
    rendered: count(body, "late-data-ok") > 0,
    digests: count(body, "digest"),
  };
}

async function closedCount(logFile) {
  try {
    const text = await readFile(logFile, "utf8");
    return count(text, "Error: Connection closed.");
  } catch {
    return 0;
  }
}

/**
 * @param {"control"|"poison"} kind
 */
async function runRound(kind, label) {
  const logFile = join(LOG_DIR, `${label}.log`);
  await rm(logFile, { force: true });
  const server = await startServer(logFile);
  try {
    const t0 = Date.now();
    if (kind === "control") {
      // Ordinary request. The cache fill runs on the request path, which has
      // no abort signal, so it completes.
      const res = await fetch(`${BASE}/slow`, { redirect: "follow" });
      await res.text();
      console.log(`   GET /slow -> http=${res.status} in ${Date.now() - t0}ms`);
    } else {
      // Runtime prefetch. This drives a *runtime prerender* of the same route.
      const res = await fetch(`${BASE}/slow`, {
        headers: { RSC: "1", "Next-Router-Prefetch": "2" },
        redirect: "follow",
      });
      await res.arrayBuffer();
      console.log(
        `   runtime-prefetch /slow -> http=${res.status} in ${Date.now() - t0}ms`,
      );
    }

    await sleep(SETTLE_MS);

    const probes = [];
    for (const path of ["/late-reader", "/b"]) {
      probes.push(await probe(path));
    }
    for (const p of probes) {
      console.log(
        `   ${p.path.padEnd(13)} http=${p.status} rendered=${String(p.rendered).padEnd(5)} digests=${p.digests}`,
      );
    }
    // Permanence: the entry is a *hit* from now on, so it never re-fills.
    const repeats = [];
    for (let i = 0; i < 3; i++) {
      await sleep(250);
      repeats.push((await probe("/late-reader")).rendered);
    }
    console.log(
      `   /late-reader re-read x3 rendered=${JSON.stringify(repeats)}`,
    );

    const closed = await closedCount(logFile);
    console.log(`   "Error: Connection closed." in server log: ${closed}`);

    const healthy =
      probes.every((p) => p.rendered) && repeats.every(Boolean) && closed === 0;
    const poisoned =
      probes.every((p) => !p.rendered) &&
      repeats.every((r) => r === false) &&
      closed > 0;
    return { healthy, poisoned, closed, logFile };
  } finally {
    await stopServer(server);
  }
}

async function main() {
  await rm(LOG_DIR, { recursive: true, force: true });
  await mkdir(LOG_DIR, { recursive: true });

  if (!SKIP_BUILD) {
    console.log("→ building…\n");
    await build();
  }

  console.log("\n══ CONTROL: ordinary request fills the same entry ══");
  const control = await runRound("control", "control");
  console.log(`   => ${control.healthy ? "HEALTHY (expected)" : "UNEXPECTED"}\n`);

  const results = [];
  for (let i = 1; i <= ROUNDS; i++) {
    console.log(`══ POISON round ${i}/${ROUNDS} ══`);
    const r = await runRound("poison", `poison-${i}`);
    console.log(`   => ${r.poisoned ? "POISONED" : "not poisoned"}\n`);
    results.push(r);
  }

  const hits = results.filter((r) => r.poisoned).length;
  console.log("══════════════════════════════════════════════════════");
  console.log(`control run healthy : ${control.healthy}`);
  console.log(`poisoned            : ${hits}/${ROUNDS} rounds`);
  console.log(`server logs         : ${LOG_DIR}`);
  console.log("══════════════════════════════════════════════════════");

  if (control.healthy && hits === ROUNDS) {
    console.log(
      "\n✔ BUG REPRODUCED\n" +
        "  A runtime prerender aborted a `use cache` fill, and the truncated\n" +
        "  (halted) Flight prelude was stored as a healthy cache entry.\n" +
        "  Every later read of that entry fails with `Error: Connection closed.`,\n" +
        "  including from routes that never triggered the fill.\n",
    );
    process.exitCode = 0;
  } else {
    console.log("\n✘ NOT REPRODUCED — see the output above.\n");
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
