// Analyzes emitted client chunks: builds the "chunk A embeds chunk B's path"
// graph (the relation whose cycles issue #97396 blames for the deadlock) and
// reports self references / strongly connected components.
//
// node analyze-chunk-graph.mjs <app-dir>
import fs from 'node:fs';
import path from 'node:path';

const dir = path.join(process.argv[2] || '.', '.next/static/chunks');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js'));
const g = new Map();
let selfRefs = [];
let withRefs = 0;
for (const f of files) {
  const src = fs.readFileSync(path.join(dir, f), 'utf8');
  const refs = new Set(
    [...src.matchAll(/static\/chunks\/([\w\-.]+\.js)/g)].map((m) => m[1])
  );
  if (refs.has(f)) selfRefs.push(f);
  refs.delete(f);
  if (refs.size) withRefs++;
  g.set(f, [...refs].filter((r) => files.includes(r)));
}
// iterative Tarjan
let idx = 0;
const index = new Map(), low = new Map(), on = new Map(), st = [], sccs = [];
for (const root of g.keys()) {
  if (index.has(root)) continue;
  const stack = [[root, 0]];
  index.set(root, idx); low.set(root, idx++); st.push(root); on.set(root, true);
  while (stack.length) {
    const top = stack[stack.length - 1];
    const [v, i] = top;
    const succ = g.get(v) || [];
    if (i < succ.length) {
      top[1]++;
      const w = succ[i];
      if (!index.has(w)) {
        index.set(w, idx); low.set(w, idx++); st.push(w); on.set(w, true);
        stack.push([w, 0]);
      } else if (on.get(w)) low.set(v, Math.min(low.get(v), index.get(w)));
    } else {
      stack.pop();
      if (low.get(v) === index.get(v)) {
        const comp = [];
        let w;
        do { w = st.pop(); on.set(w, false); comp.push(w); } while (w !== v);
        if (comp.length > 1) sccs.push(comp);
      }
      if (stack.length) {
        const p = stack[stack.length - 1][0];
        low.set(p, Math.min(low.get(p), low.get(v)));
      }
    }
  }
}
console.log(`chunks=${files.length} chunks_referencing_other_chunks=${withRefs}`);
console.log(`self_referencing_chunks=${selfRefs.length}`, selfRefs.slice(0, 5));
console.log(`non_trivial_sccs=${sccs.length}`, sccs.map((c) => c.length).slice(0, 10));
