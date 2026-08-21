// Fetches the page from a running `pnpm dev` server, finds the node_modules chunk
// source map, and decodes its VLQ mappings looking for structurally impossible
// column deltas (near 2^32) and negative cumulative original columns.
const base = process.env.BASE_URL || 'http://localhost:3099';
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
function decodeVlq(s) {
  const out = [];
  let i = 0;
  while (i < s.length) {
    let res = 0, shift = 0, cont, d;
    do {
      d = B64.indexOf(s[i++]);
      cont = d & 32;
      res += (d & 31) * Math.pow(2, shift);
      shift += 5;
    } while (cont);
    const neg = res & 1;
    res = Math.floor(res / 2);
    out.push(neg ? -res : res);
  }
  return out;
}

const html = await (await fetch(base + '/')).text();
const chunk = [...html.matchAll(/_next\/static\/chunks\/(node_modules[^"]*?\.js)/g)].map((m) => m[1])[0];
if (!chunk) throw new Error('no node_modules chunk found in HTML');
const mapUrl = `${base}/_next/static/chunks/${chunk}.map`;
const res = await fetch(mapUrl);
console.log('map', mapUrl, 'status', res.status);
const map = JSON.parse(await res.text());
const sections = map.sections ?? [{ offset: { line: 0, column: 0 }, map }];
let failures = 0;
for (const [i, section] of sections.entries()) {
  const m = section.map;
  let srcCol = 0, srcLine = 0, genCol = 0;
  const bad = [], negative = [];
  m.mappings.split(';').forEach((line, ln) => {
    genCol = 0;
    for (const tok of line.split(',').filter(Boolean)) {
      const f = decodeVlq(tok);
      genCol += f[0];
      if (f.length >= 4) {
        srcLine += f[2];
        srcCol += f[3];
        if (Math.abs(f[3]) > 1e6) bad.push({ tok, fields: f, generatedLine: ln + 1 });
        if (srcCol < 0) negative.push({ tok, generatedLine: ln + 1, originalColumn: srcCol });
      }
    }
  });
  console.log(
    `section ${i} sources=${(m.sources || []).map((s) => s.split('/').pop()).join(',')} ` +
      `hugeColumnDeltas=${bad.length} negativeOriginalColumns=${negative.length}`
  );
  for (const b of bad.slice(0, 4)) console.log('  huge:', b.tok, JSON.stringify(b.fields), 'genLine', b.generatedLine);
  for (const n of negative.slice(0, 4)) console.log('  negative:', n.tok, 'genLine', n.generatedLine, 'originalColumn', n.originalColumn);
  failures += bad.length + negative.length;
}
console.log(failures ? `FAIL: ${failures} invalid mapping segments` : 'PASS: mappings look sane');
process.exit(failures ? 1 : 0);
