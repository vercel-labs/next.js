import { chromium } from 'playwright';
const A='/workspace/.next-maintainer/reproduction-artifacts/playwright';
const b = await chromium.launch();
for (const [name, url, js] of [
  ['prod-blog-foo-nojs','http://localhost:3002/blog/foo',false],
  ['prod-blog-foo-js','http://localhost:3002/blog/foo',true],
  ['prod-unmatched-nojs','http://localhost:3002/nonexistent-route',false],
  ['dev-blog-foo-nojs','http://localhost:3001/blog/foo',false],
]) {
  const ctx = await b.newContext({ javaScriptEnabled: js });
  const p = await ctx.newPage();
  const r = await p.goto(url, { waitUntil: 'load' });
  await p.waitForTimeout(1500);
  const text = (await p.evaluate(() => document.body.innerText)).trim();
  await p.screenshot({ path: `${A}/${name}.png`, fullPage: true });
  console.log(name, 'status=' + r.status(), 'bodyText=' + JSON.stringify(text));
  await ctx.close();
}
await b.close();
