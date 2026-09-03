const fs=require('fs'),p=require('path');
fs.rmSync('app',{recursive:true,force:true});
fs.mkdirSync('app/lib',{recursive:true});
fs.writeFileSync('app/lib/meta.ts',`export async function makeMeta(name: string){
  await new Promise((r)=>setTimeout(r, 5))
  const mod = await import('./extra')
  return { title: name + mod.suffix, description: 'desc ' + name }
}
`);
fs.writeFileSync('app/lib/extra.ts',`export const suffix = ' | site'\n`);
fs.writeFileSync('app/layout.tsx',`export const metadata = { title: 'root' }
export default function RootLayout({children}:{children:React.ReactNode}){return <html><body>{children}</body></html>}
`);
fs.writeFileSync('app/page.tsx',`export default function Page(){return <main>home</main>}\n`);
fs.writeFileSync('app/not-found.tsx',`export default function NF(){return <div>nf</div>}\n`);
const groups=40, pagesPer=7;
for(let g=0;g<groups;g++){
  const gd=`app/(group${g})`;
  fs.mkdirSync(gd,{recursive:true});
  fs.writeFileSync(p.join(gd,'layout.tsx'),`import { makeMeta } from '../lib/meta'
export async function generateMetadata(){ return makeMeta('g${g}') }
export default function L({children}:{children:React.ReactNode}){return <section>{children}</section>}
`);
  for(let i=0;i<pagesPer;i++){
    const d=p.join(gd,`seg${g}-${i}`);
    fs.mkdirSync(d,{recursive:true});
    fs.writeFileSync(p.join(d,'page.tsx'),`import { makeMeta } from '../../lib/meta'
export async function generateMetadata(){ return makeMeta('p${g}-${i}') }
export default async function Page(){ const m = await import('../../lib/extra'); return <div>page ${g}-${i}{m.suffix}</div> }
`);
  }
}
