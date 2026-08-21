// Checks built client chunks against the package.json browserslist targets:
//  1) parse every chunk as ES2019 (chrome 64 supports at most ES2019 syntax)
//  2) count `globalThis` references (globalThis requires Chrome 71+)
//  3) execute each chunk in a context without a `globalThis` binding
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import * as acorn from 'acorn';

const dir = process.argv[2] ?? '.next/static/chunks';
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (/\.m?js$/.test(e.name)) files.push(p);
  }
})(dir);

let bad = 0;
for (const f of files.sort()) {
  const src = fs.readFileSync(f, 'utf8');

  let es2019 = 'ok';
  try {
    acorn.parse(src, { ecmaVersion: 2019, sourceType: 'script' });
  } catch (e) {
    es2019 = `ES2020+ syntax: ${e.message}`;
  }

  let globalThisRefs = 0;
  try {
    for (const tok of acorn.tokenizer(src, { ecmaVersion: 'latest' })) {
      if (tok.type.label === 'name' && tok.value === 'globalThis') globalThisRefs++;
    }
  } catch {}

  const ctx = vm.createContext(Object.create(null));
  vm.runInContext('var window=this, self=this, document={}, navigator={userAgent:"old"};', ctx);
  vm.runInContext('delete this.globalThis;', ctx);
  let run = 'ok';
  try {
    vm.runInContext(src, ctx, { filename: f });
  } catch (e) {
    run = `${e.constructor.name}: ${e.message}`;
  }

  const failed = es2019 !== 'ok' || globalThisRefs > 0;
  if (failed) bad++;
  console.log(
    `${failed ? 'FAIL' : 'ok  '} ${path.basename(f)}  es2019=${es2019}  globalThis=${globalThisRefs}  no-globalThis-eval=${run}`
  );
}
console.log(`\n${bad}/${files.length} chunks violate the browserslist targets`);
process.exit(bad ? 1 : 0);
