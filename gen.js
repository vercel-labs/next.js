const fs=require('fs'),p=require('path');
fs.rmSync('app',{recursive:true,force:true});
const w=(f,c)=>{fs.mkdirSync(p.dirname(f),{recursive:true});fs.writeFileSync(f,c)};
w('app/layout.tsx',`export default function RootLayout({children}:{children:React.ReactNode}){return <html><body>{children}</body></html>}`);
w('app/page.tsx',`export default function Home(){return <p>home</p>}`);
const slugs=Array.from({length:40},(_,i)=>'slug-'+i);
const gsp=`export async function generateStaticParams(){return ${JSON.stringify(slugs.map(s=>({slug:s})))}}\nexport const dynamicParams = false;\n`;
// family under nested route groups
for(const base of ['app/(sv)/(public)/kommun','app/(sv)/(public)/vardcentral','app/(en)/en/vardcentral']){
  w(base+'/[slug]/page.tsx',gsp+`export default async function P({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <p>leaf {slug}</p>}`);
  w(base+'/[slug]/byta/page.tsx',gsp+`export default async function P({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <p>byta {slug}</p>}`);
  w(base+'/[slug]/ring/page.tsx',gsp+`export default async function P({params}:{params:Promise<{slug:string}>}){const {slug}=await params;return <p>ring {slug}</p>}`);
  w(base+'/[slug]/feed.xml/route.ts',gsp+`export async function GET(){return new Response('<rss/>',{headers:{'content-type':'application/xml'}})}`);
}
// same shape outside route groups (control)
w('app/plain/[slug]/page.tsx',gsp+`export default function P(){return <p>plain leaf</p>}`);
w('app/plain/[slug]/ring/page.tsx',gsp+`export default function P(){return <p>plain ring</p>}`);
// 150 filler pages with some module graph weight
for(let i=0;i<Number(process.env.FILLER||150);i++){
  w(`app/(sv)/(public)/filler-${i}/page.tsx`,`import {v} from '../../../lib/mod${i%20}';\nexport default function F(){return <p>filler ${i} {v}</p>}`);
}
for(let i=0;i<20;i++) w(`app/lib/mod${i}.ts`,`export const v = ${i};\n`+Array.from({length:50},(_,k)=>`export const x${k} = ${k}*${i};`).join('\n'));
w('next.config.js',`module.exports = {};`);
w('tsconfig.json',JSON.stringify({compilerOptions:{target:"ES2020",lib:["dom","es2020"],jsx:"preserve",module:"esnext",moduleResolution:"bundler",strict:true,noEmit:true,skipLibCheck:true,esModuleInterop:true,incremental:true,plugins:[{name:"next"}]},include:["**/*.ts","**/*.tsx",".next/types/**/*.ts"],exclude:["node_modules"]},null,2));
console.log('done');
