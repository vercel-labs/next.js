const fs=require('fs'),path=require('path');
function walk(d,out=[]){for(const e of fs.readdirSync(d,{withFileTypes:true})){const p=path.join(d,e.name);if(e.isDirectory())walk(p,out);else if(e.name.endsWith('.nft.json'))out.push(p);}return out;}
const files=walk('.next/server').concat(fs.existsSync('.next/next-server.js.nft.json')?['.next/next-server.js.nft.json']:[]);
const set=new Map();
for(const f of files){const j=JSON.parse(fs.readFileSync(f,'utf8'));for(const rel of j.files){const abs=path.resolve(path.dirname(f),rel);set.set(abs,true);}}
let total=0,missing=0;const byTop={};
for(const abs of set.keys()){let s;try{s=fs.statSync(abs);}catch{missing++;continue;}if(!s.isFile())continue;total+=s.size;
 const rel=path.relative(process.cwd(),abs);const key=rel.startsWith('..')?'OUTSIDE_CWD':rel.split(path.sep).slice(0,2).join('/');byTop[key]=(byTop[key]||0)+s.size;}
console.log('nft.json count',files.length,'unique traced files',set.size,'missing',missing);
console.log('TOTAL traced bytes',(total/1e6).toFixed(1),'MB');
const top=Object.entries(byTop).sort((a,b)=>b[1]-a[1]).slice(0,15);
for(const [k,v] of top) console.log((v/1e6).toFixed(1).padStart(8),'MB ',k);
