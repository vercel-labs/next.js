// Instruments the SHIPPED standalone build so the abort reason's cost can be
// measured inside real Next.js (not a synthetic mock). Run AFTER `next build`.
//
// It patches abortOnSynchronousDynamicDataAccess in
//   .next/standalone/node_modules/next/dist/server/app-render/dynamic-rendering.js
// to:
//   1. retain every aborted prerender AbortSignal in globalThis.__KEPT_SIGNALS__
//      (simulating instrumentation / userland holding the signal),
//   2. optionally apply the proposed fix `error.stack = name + ': ' + message`
//      when NEXT_ABORT_FIX=1,
//   3. optionally print the reason's captured frames once when NEXT_ABORT_DUMP=1.
import { readFileSync, writeFileSync } from "node:fs";

const p = ".next/standalone/node_modules/next/dist/server/app-render/dynamic-rendering.js";
let s = readFileSync(p, "utf8");
const anchor = "    prerenderStore.controller.abort(error);";
if (s.includes("__KEPT_SIGNALS__")) { console.log("already patched"); process.exit(0); }
if (!s.includes(anchor)) { console.log("ANCHOR MISSING - Next internals changed"); process.exit(1); }
s = s.replace(anchor, `    if (process.env.NEXT_ABORT_FIX === '1') { error.stack = \`\${error.name}: \${error.message}\`; }
    prerenderStore.controller.abort(error);
    (globalThis.__KEPT_SIGNALS__ ||= []).push(prerenderStore.controller.signal);
    if (process.env.NEXT_ABORT_DUMP === '1' && !globalThis.__DUMPED__) { globalThis.__DUMPED__ = 1; console.log('--- abort reason stack ---\\n' + error.stack + '\\n--- end ---'); }`);
writeFileSync(p, s);
console.log("patched retention harness");
