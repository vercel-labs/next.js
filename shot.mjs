import { chromium } from 'playwright';
const dir='/workspace/.next-maintainer/reproduction-artifacts/playwright';
const b=await chromium.launch();const p=await b.newPage();
for (const [path,name] of [['/','root-404'],['/en','en-404'],['/en-US','en-US-ok']]) {
  const r = await p.goto('http://localhost:3000'+path,{waitUntil:'networkidle'});
  console.log(path, r.status());
  await p.screenshot({path:`${dir}/${name}.png`, fullPage:true});
}
await b.close();
