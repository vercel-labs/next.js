import fs from 'fs';import zlib from 'zlib';import path from 'path';
const dir=process.argv[2];
const m=JSON.parse(fs.readFileSync(path.join(dir,'.next/build-manifest.json'),'utf8'));
const files=[...new Set([...(m.pages['/_app']||[]),...(m.pages['/']||[])])].filter(f=>f.endsWith('.js')&&!f.includes('polyfills'));
let t=0;for(const f of files){const b=fs.readFileSync(path.join(dir,'.next',f));const g=zlib.gzipSync(b).length;t+=g;console.log((g/1024).toFixed(1).padStart(7),'kB',f);}
console.log('TOTAL first-load JS (gzip, excl polyfills):',(t/1024).toFixed(1),'kB');
