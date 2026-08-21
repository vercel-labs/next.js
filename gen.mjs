import fs from 'node:fs';
const N = Number(process.argv[2] ?? 200); // routes
const C = Number(process.argv[3] ?? 20); // components per route
fs.rmSync('app/r', { recursive: true, force: true });
fs.rmSync('components', { recursive: true, force: true });
fs.mkdirSync('components', { recursive: true });
for (let i = 0; i < N * C; i++) {
  fs.writeFileSync(
    `components/c${i}.module.css`,
    `.box${i} {\n  padding: ${1 + (i % 20)}px;\n  color: rgb(${i % 255} 10 20);\n}\n`
  );
  fs.writeFileSync(
    `components/c${i}.tsx`,
    `import s from "./c${i}.module.css";\nexport default function C${i}({ v }: { v: number }) {\n  return <div className={s.box${i} + " p-1 text-sm"}>c${i} {v} ${'x'.repeat(120)}</div>;\n}\n`
  );
}
for (let i = 0; i < N; i++) {
  fs.mkdirSync(`app/r/${i}`, { recursive: true });
  const imports = Array.from({ length: C }, (_, j) => `import C${i * C + j} from "../../../components/c${i * C + j}";`).join('\n');
  const uses = Array.from({ length: C }, (_, j) => `<C${i * C + j} v={n} />`).join('');
  fs.writeFileSync(
    `app/r/${i}/page.tsx`,
    `${imports}\nexport const dynamic = "force-dynamic";\nexport default async function P() {\n  const n = Date.now();\n  return <main className="p-4">route ${i} {n}${uses}</main>;\n}\n`
  );
}
console.log('generated', N, 'routes', N * C, 'components +', N * C, 'css modules');
