// Generates a synthetic Next.js app with many modules and a dense ring of
// dynamic imports between "feature" modules, to try to force Turbopack's
// production chunk merger to build a chunk-level reference ring.
//
// Usage: node gen.mjs <outDir> [features] [leavesPerFeature] [pages]
import fs from 'node:fs';
import path from 'node:path';

const out = process.argv[2] || 'app-gen';
const F = Number(process.argv[3] || 64); // feature modules (each = one import() target)
const L = Number(process.argv[4] || 24); // unique leaf modules statically imported per feature
const P = Number(process.argv[5] || 4); // pages
const SHARED = Number(process.argv[6] || 12);
const PAY = Number(process.argv[7] || 24); // payload strings per leaf // shared static libs

const rnd = (n, seed) => {
  // deterministic pseudo-random alphanumeric payload
  let s = seed * 2654435761 % 4294967296;
  let o = '';
  const cs = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for (let i = 0; i < n; i++) {
    s = (s * 1103515245 + 12345) % 2147483648;
    o += cs[s % cs.length];
  }
  return o;
};

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(path.join(out, 'app'), { recursive: true });
fs.mkdirSync(path.join(out, 'features'), { recursive: true });
fs.mkdirSync(path.join(out, 'leaves'), { recursive: true });
fs.mkdirSync(path.join(out, 'shared'), { recursive: true });

fs.writeFileSync(
  path.join(out, 'package.json'),
  JSON.stringify(
    {
      name: 'turbopack-chunk-ring-repro',
      private: true,
      scripts: { build: 'next build', dev: 'next dev' },
      dependencies: { next: '16.3.1', react: '19.2.8', 'react-dom': '19.2.8' },
    },
    null,
    2
  )
);
fs.writeFileSync(path.join(out, 'next.config.js'), 'module.exports = {};\n');

// shared static libs (pull chunks over the merge thresholds)
for (let j = 0; j < SHARED; j++) {
  let src = `export function lib_${j}(x) {\n  const d = [\n`;
  for (let k = 0; k < 60; k++) src += `    '${rnd(120, j * 1000 + k)}',\n`;
  src += `  ];\n  return d[(x|0) % d.length].length + ${j};\n}\n`;
  fs.writeFileSync(path.join(out, 'shared', `s${j}.js`), src);
}

// leaves (payload lives inside the exported function so it survives tree shaking)
for (let i = 0; i < F; i++) {
  for (let l = 0; l < L; l++) {
    let src = `// leaf ${i}_${l}\nexport function leaf_${i}_${l}(n) {\n  const d = [\n`;
    for (let k = 0; k < PAY; k++) src += `    '${rnd(140, i * 10000 + l * 100 + k)}',\n`;
    src += `  ];\n  return d[(n|0) % d.length].length + ${l};\n}\n`;
    fs.writeFileSync(path.join(out, 'leaves', `l${i}_${l}.js`), src);
  }
}

// features: static leaves + shared libs, dynamic ring imports to other features
for (let i = 0; i < F; i++) {
  let src = `// feature ${i}\n`;
  for (let l = 0; l < L; l++) src += `import { leaf_${i}_${l} } from '../leaves/l${i}_${l}';\n`;
  for (let j = 0; j < SHARED; j++) if ((i + j) % 3 === 0) src += `import { lib_${j} } from '../shared/s${j}';\n`;
  const targets = [
    (i + 1) % F,
    (i + 7) % F,
    (i + 13) % F,
    (i + F - 1) % F,
    (i * 5 + 3) % F,
  ];
  src += `\nexport async function run_${i}(k) {\n  let total = 0;\n`;
  for (let l = 0; l < L; l++) src += `  total += leaf_${i}_${l}(${l});\n`;
  for (let j = 0; j < SHARED; j++) if ((i + j) % 3 === 0) src += `  total += lib_${j}(k);\n`;
  targets.forEach((t, n) => {
    src += `  if (k === ${n}) total += await hop_${i}_${n}(k);\n`;
  });
  src += `  return total;\n}\n\n`;
  targets.forEach((t, n) => {
    src += `export async function hop_${i}_${n}(k) {\n  const m = await import('./f${t}');\n  return (await m.run_${t}(k)) + (k > 0 ? await m.hop_${t}_${n % 3}(k - 1) : 0);\n}\n\n`;
  });
  fs.writeFileSync(path.join(out, 'features', `f${i}.js`), src);
}

// pages: each page dynamically imports a slice of features (registry pattern)
const pageBody = (ids, up) => {
  let s = `'use client';\nimport { useState } from 'react';\n\nconst registry = {\n`;
  for (const i of ids) s += `  f${i}: () => import('${up}features/f${i}'),\n`;
  s += `};\n\nexport default function Page() {\n  const [k, setK] = useState(0);\n  const [r, setR] = useState('');\n  return (\n    <main>\n      <input value={k} onChange={(e) => setK(Number(e.target.value))} />\n      <button onClick={async () => {\n        const keys = Object.keys(registry);\n        const m = await registry[keys[k % keys.length]]();\n        setR(String(await m[Object.keys(m).find((x) => x.startsWith('run_'))](k)));\n      }}>go</button>\n      <pre>{r}</pre>\n    </main>\n  );\n}\n`;
  return s;
};

fs.writeFileSync(
  path.join(out, 'app', 'layout.js'),
  `export default function Layout({ children }) { return (<html><body>{children}</body></html>); }\n`
);
const all = [...Array(F).keys()];
fs.writeFileSync(path.join(out, 'app', 'page.js'), pageBody(all, '../'));
for (let p = 1; p < P; p++) {
  fs.mkdirSync(path.join(out, 'app', `p${p}`), { recursive: true });
  // overlapping slices so groups share chunks
  const ids = all.filter((i) => (i + p) % P !== 0 || i % 2 === p % 2);
  fs.writeFileSync(path.join(out, 'app', `p${p}`, 'page.js'), pageBody(ids, '../../'));
}

console.log(
  `generated ${out}: features=${F} leaves=${F * L} pages=${P} shared=${SHARED}`
);
