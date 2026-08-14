// Proves the code path under test is actually reached, rather than assuming it.
// Appends a marker to hits.log every time Next constructs a prerender-interrupt
// Error. Run AFTER `npm run build` (the build regenerates the standalone tree).
import { readFileSync, writeFileSync } from "node:fs";

const LOG = new URL("hits.log", import.meta.url).pathname;
const BASE = new URL(".next/standalone/node_modules/next/dist/", import.meta.url).pathname;

const mark = (file, anchor, marker) => {
  const path = BASE + file;
  let s;
  try {
    s = readFileSync(path, "latin1");
  } catch {
    console.log(`skip (not shipped): ${file}`);
    return;
  }
  if (s.includes(marker)) return console.log(`already marked: ${file}`);
  const i = s.indexOf(anchor);
  if (i < 0) return console.log(`ANCHOR NOT FOUND: ${file}`);
  const ins = `try{require('fs').appendFileSync('${LOG}','${marker}\\n')}catch(e){}`;
  writeFileSync(path, s.slice(0, i + anchor.length) + ins + s.slice(i + anchor.length), "latin1");
  console.log(`marked: ${file}`);
};

mark(
  "server/app-render/dynamic-rendering.js",
  "error.digest = NEXT_PRERENDER_INTERRUPTED;",
  "HIT_DYNAMIC_RENDERING",
);
mark(
  "compiled/next-server/app-route-turbo.runtime.prod.js",
  "function ra(e){",
  "HIT_APP_ROUTE_TURBO",
);
