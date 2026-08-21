import { chromium, devices } from 'playwright';
const OUT='/workspace/.next-maintainer/reproduction-artifacts/playwright';
const mode = process.argv[2] || 'touch';
const browser = await chromium.launch();
const ctx = await browser.newContext(mode==='touch' ? devices['Galaxy S9+'] : {viewport:{width:1280,height:800}});
const page = await ctx.newPage();
await page.goto('http://localhost:3000', {waitUntil:'load'});
const logo = page.locator('#next-logo');
await logo.waitFor({state:'visible', timeout:60000});
await page.evaluate(()=>{ window.__ev=[]; for (const t of ['pointerdown','pointermove','pointerup','pointercancel','touchstart','touchmove','touchend','touchcancel']) window.addEventListener(t, e=>window.__ev.push(t), true); });
const b0 = await logo.boundingBox();
console.log('start box', JSON.stringify(b0));
const cx = Math.round(b0.x+b0.width/2), cy = Math.round(b0.y+b0.height/2);
const cdp = await ctx.newCDPSession(page);
const positions=[];
if (mode==='touch') {
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:cx,y:cy}]});
  for (let d=10; d<=300; d+=10) {
    await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:cx+d,y:cy-d}]});
    await page.waitForTimeout(30);
    const b = await logo.boundingBox();
    positions.push({d, dx:Math.round(b.x-b0.x), dy:Math.round(b.y-b0.y)});
  }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
} else {
  await page.mouse.move(cx,cy); await page.mouse.down();
  for (let d=10; d<=300; d+=10) {
    await page.mouse.move(cx+d, cy-d);
    await page.waitForTimeout(30);
    const b = await logo.boundingBox();
    positions.push({d, dx:Math.round(b.x-b0.x), dy:Math.round(b.y-b0.y)});
  }
  await page.mouse.up();
}
console.log('mode', mode);
console.log(positions.map(p=>`move=${p.d} -> dx=${p.dx} dy=${p.dy}`).join('\n'));
const ev = await page.evaluate(()=>window.__ev.reduce((a,t)=>(a[t]=(a[t]||0)+1,a),{}));
console.log('events', JSON.stringify(ev));
const ta = await page.evaluate(()=>{const el=document.querySelector('nextjs-portal')?.shadowRoot?.querySelector('#next-logo'); const r=el?.closest('[data-nextjs-toast]')||el; return {logoTouchAction:el?getComputedStyle(el).touchAction:null, containerTouchAction:r?getComputedStyle(r).touchAction:null, bodyTouchAction:getComputedStyle(document.body).touchAction};});
console.log('touchAction', JSON.stringify(ta));
await page.screenshot({path:`${OUT}/${mode}-after-drag.png`});
await browser.close();
