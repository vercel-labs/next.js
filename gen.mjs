// Generates: 12 "heavy" modules that allocate ~150MB each at import time
// (stand-ins for a large real-world module graph: ORM clients, generated
// schemas, icon barrels...), and 30 pages that all import them.
import { writeFileSync, mkdirSync } from 'node:fs';
mkdirSync('lib', { recursive: true });
mkdirSync('pages/gen', { recursive: true });
for (let m = 0; m < 12; m++) {
  writeFileSync(`lib/heavy-${m}.js`,
`// ~150MB resident at import time — simulates a large module graph's footprint.
export const data${m} = Array.from({ length: 1_200_000 }, (_, i) => ({
  id: i, key: 'k' + i, pad: 'x'.repeat(64),
}));
export const sum${m} = data${m}.length;
`);
}
const imports = Array.from({ length: 12 }, (_, m) => `import { sum${m} } from '../../lib/heavy-${m}';`).join('\n');
const sums = Array.from({ length: 12 }, (_, m) => `sum${m}`).join(' + ');
for (let p = 0; p < 30; p++) {
  writeFileSync(`pages/gen/page-${p}.jsx`,
`${imports}

export async function getStaticProps() {
  return { props: { total: ${sums}, page: ${p} } };
}

export default function Page${p}({ total, page }) {
  return <main>page {page} — {total}</main>;
}
`);
}
console.log('generated 12 heavy modules + 30 pages');
