import { chromium } from 'playwright';
const OUT='/workspace/.next-maintainer/reproduction-artifacts/playwright';
const b = await chromium.launch({executablePath:'/root/.cache/ms-playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell'});
const page = await (await b.newContext()).newPage();
const bad=new Set();
page.on('response', r=>{ if(r.status()>=400) bad.add(r.status()+' '+r.url()); });
const cases=[['/blog2',['auto','auto2']],['/blog3',['true','true2']],['/blog',['auto','true','auto2']]];
for(const [path,ids] of cases){
  for(const id of ids){
    await page.goto('http://localhost:3000'+path,{waitUntil:'networkidle'});
    await page.waitForTimeout(1200);
    await page.click('#'+id);
    await page.waitForTimeout(2000);
    const ok = page.url().includes('/blog/post-1');
    console.log(path, id, ok?'NAVIGATED':'STUCK at '+page.url());
    await page.screenshot({path:`${OUT}/${path.slice(1)}-${id}.png`});
  }
}
console.log('--- non-2xx ---'); console.log([...bad].join('\n'));
await b.close();
