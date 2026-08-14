// Applies the candidate fix to the *built* output, in place: capture the abort
// listener that react-server-dom-webpack's prerender() attaches to the composite
// signal and remove it where the wrapper already clears its timeout. Run after
// `npm run build`, then `node drive.mjs` to compare.
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import path from "node:path";

const dir = ".next/standalone/.next/server/chunks/ssr";
const file = readdirSync(dir).find((f) => f.endsWith(".js") && readFileSync(path.join(dir, f), "utf8").includes("AbortSignal.any"));
if (!file) throw new Error("could not find the built chunk containing AbortSignal.any");
const p = path.join(dir, file);
let s = readFileSync(p, "utf8");

const a = "d?AbortSignal.any([d,b.signal]):b.signal";
const a2 =
  '(()=>{if(!d)return b.signal;const z=AbortSignal.any([d,b.signal]);' +
  'globalThis.__detach=globalThis.__detach||new WeakMap();const L=[];globalThis.__detach.set(z,L);' +
  'const orig=EventTarget.prototype.addEventListener;' +
  'z.addEventListener=function(...args){if(args[0]==="abort")L.push(args);return orig.apply(this,args)};return z})()';
const b = "if(clearTimeout(c),b.signal.aborted)";
const b2 =
  "if(clearTimeout(c),(()=>{const L=globalThis.__detach&&globalThis.__detach.get(g);" +
  "if(L){delete g.addEventListener;for(const args of L)g.removeEventListener(...args);L.length=0}})(),b.signal.aborted)";

for (const [from, to] of [[a, a2], [b, b2]]) {
  if (!s.includes(from)) throw new Error(`pattern not found (Next version drift?): ${from}`);
  s = s.split(from).join(to);
}
writeFileSync(p, s);
console.log(`patched ${p}`);
