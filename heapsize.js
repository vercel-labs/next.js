// node heapsize.js <file.heapsnapshot> -> total retained self_size + top object counts
const fs = require('fs');
const s = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const nf = s.snapshot.meta.node_fields, n = nf.length;
const si = nf.indexOf('self_size'), ti = nf.indexOf('type'), ni = nf.indexOf('name');
const types = s.snapshot.meta.node_types[0];
let total = 0; const counts = {};
const watch = new Set(['AbortSignal', 'Listener', 'abort']);
for (let i = 0; i < s.nodes.length; i += n) {
  total += s.nodes[i + si];
  const nm = s.strings[s.nodes[i + ni]];
  if (watch.has(nm)) { const k = types[s.nodes[i + ti]] + ':' + nm; counts[k] = (counts[k] || 0) + 1; }
}
console.log(process.argv[2], 'total MB', (total / 1048576).toFixed(1), JSON.stringify(counts));
