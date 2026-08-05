import { chromium, devices } from 'playwright';
const ART=process.env.ART || './artifacts';
const b = await chromium.launch();
const ctx = await b.newContext({ ...devices['iPhone 15'], recordVideo:{dir:ART+'/video'} });
const p = await ctx.newPage();
const cdp = await ctx.newCDPSession(p);
await p.goto('http://localhost:3000', {waitUntil:'networkidle'});
await p.waitForTimeout(4000);

await p.evaluate(() => {
  const sr = document.querySelector('nextjs-portal').shadowRoot;
  const el = sr.getElementById('devtools-indicator');
  window.__log = [];
  for (const t of ['pointerdown','pointermove','pointerup','pointercancel','touchstart','touchmove','touchend','touchcancel'])
    el.addEventListener(t, e => window.__log.push(t), true);
  window.__state = () => {
    const el2 = sr.getElementById('devtools-indicator');
    // the draggable div is the child wrapper with translate
    const nodes=[...sr.querySelectorAll('div')].map(d=>({cls:d.className,tr:d.style.translate})).filter(d=>d.tr||String(d.cls).includes('grab'));
    return {scrollY: window.scrollY, nodes, bodyUserSelect: document.body.style.userSelect,
      rect: el2.getBoundingClientRect().toJSON()};
  };
});
const before = await p.evaluate(()=>window.__state());
const box = await p.evaluate(()=>{const r=document.querySelector('nextjs-portal').shadowRoot.getElementById('devtools-indicator').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}});
console.log('start', box, JSON.stringify(before));

const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', {type, touchPoints: type==='touchEnd'?[]:[{x,y,id:1}]});
await touch('touchStart', box.x, box.y);
for (let i=1;i<=12;i++){ await touch('touchMove', box.x+i*2, box.y - i*15); await p.waitForTimeout(30); }
await p.waitForTimeout(300);
const during = await p.evaluate(()=>window.__state());
console.log('during', JSON.stringify(during));
await touch('touchEnd', 0, 0);
await p.waitForTimeout(1500);
const after = await p.evaluate(()=>({...window.__state(), log: window.__log}));
console.log('after', JSON.stringify(after));
await p.screenshot({path: ART+'/after-touch-drag.png'});

// try a tap to see if indicator still responds / is stuck
await touch('touchStart', box.x, box.y); await touch('touchEnd',0,0);
await p.waitForTimeout(800);
console.log('afterTap', JSON.stringify(await p.evaluate(()=>window.__state())));
await p.screenshot({path: ART+'/after-tap.png'});
await ctx.close(); await b.close();
