import { chromium } from 'playwright';
const ART=process.env.ART || './artifacts';
const b = await chromium.launch();
const p = await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await p.goto('http://localhost:3000',{waitUntil:'networkidle'}); await p.waitForTimeout(4000);
const st=()=>p.evaluate(()=>{const sr=document.querySelector('nextjs-portal').shadowRoot;const r=sr.getElementById('devtools-indicator').getBoundingClientRect();return{y:r.y,x:r.x,nodes:[...sr.querySelectorAll('div')].map(d=>({c:d.className,t:d.style.translate})).filter(d=>d.t||String(d.c).includes('grab')),us:document.body.style.userSelect}});
const box=await p.evaluate(()=>{const r=document.querySelector('nextjs-portal').shadowRoot.getElementById('devtools-indicator').getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}});
await p.mouse.move(box.x,box.y); await p.mouse.down();
for(let i=1;i<=12;i++){await p.mouse.move(box.x+i*2,box.y-i*15); await p.waitForTimeout(30);}
await p.mouse.up(); await p.waitForTimeout(1500);
console.log('mouse after', JSON.stringify(await st()));
await p.screenshot({path:ART+'/control-mouse-drag.png'});
await b.close();
