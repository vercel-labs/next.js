import { chromium } from 'playwright';
const url = process.argv[2] || 'http://localhost:3000';
const tag = process.argv[3] || 'run';
const b = await chromium.launch();
const p = await b.newPage();
await p.route('**www.googletagmanager.com/**', r => r.fulfill({status:200, contentType:'application/javascript', body:'window.__gtmLoaded=true;'}));
await p.goto(url, {waitUntil:'networkidle'});
const info = await p.evaluate(() => {
  const out = [];
  document.querySelectorAll('script').forEach(s => {
    const src = s.src || '';
    const inline = (s.textContent||'').slice(0,80);
    if (src.includes('googletagmanager') || inline.includes('dataLayer') || inline.includes('GTM-')) {
      out.push({parent: s.parentElement.tagName, src, inline, id: s.id});
    }
  });
  return {scripts: out, headHasGtm: !!document.head.querySelector('script[src*="googletagmanager"]'), dataLayer: typeof window.dataLayer};
});
console.log(tag, JSON.stringify(info, null, 2));
await p.screenshot({path:`/workspace/.next-maintainer/reproduction-artifacts/playwright/${tag}.png`, fullPage:true});
await b.close();
