// Prints which react-dom copies and which next/dist modules end up in the
// client chunks, and which chunks each app-router entry actually loads.
import fs from 'node:fs';

const chunks = fs.readdirSync('.next/static/chunks').filter((f) => f.endsWith('.js'));
for (const f of chunks) {
  const src = fs.readFileSync(`.next/static/chunks/${f}`, 'utf8');
  const versions = [...new Set(src.match(/\b(18|19)\.\d+\.\d+(-canary-[\w-]+)?/g) || [])];
  if (versions.length) console.log(f, versions.join(', '));
}
console.log('\napp-build-manifest (chunks loaded by app router entries):');
console.log(fs.readFileSync('.next/app-build-manifest.json', 'utf8'));
console.log('\npages entries still emitted for an app-router-only app:');
const bm = JSON.parse(fs.readFileSync('.next/build-manifest.json', 'utf8'));
console.log(JSON.stringify(bm.pages, null, 1));
