import { launch } from 'chrome-launcher';
import lighthouse from 'lighthouse';
import fs from 'node:fs';

const BASE = process.env.BASE_URL || 'http://localhost:3000';
const RUNS = Number(process.env.RUNS || 3);
const routes = (process.env.ROUTES || '/next-image,/plain-img').split(',');
const results = {};
fs.mkdirSync('./lighthouse-reports', { recursive: true });

const chrome = await launch({
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
  chromePath: process.env.CHROME_PATH,
});

for (const route of routes) {
  results[route] = [];
  for (let i = 0; i < RUNS; i++) {
    const r = await lighthouse(BASE + route, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance'],
      formFactor: 'mobile',
      screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false },
    });
    const a = r.lhr.audits;
    results[route].push({
      score: Math.round(r.lhr.categories.performance.score * 100),
      FCP: a['first-contentful-paint'].numericValue,
      LCP: a['largest-contentful-paint'].numericValue,
      TBT: a['total-blocking-time'].numericValue,
      SI: a['speed-index'].numericValue,
      lcpElement: a['largest-contentful-paint-element']?.details?.items?.[0]?.items?.[0]?.node?.snippet,
    });
    fs.writeFileSync(`./lighthouse-reports/lighthouse${route.replace(/\//g, '-')}-${i}.json`, JSON.stringify(r.lhr));
  }
}

const med = (xs) => xs.slice().sort((a, b) => a - b)[Math.floor(xs.length / 2)];
for (const route of routes) {
  const rs = results[route];
  console.log(route, {
    score: med(rs.map((r) => r.score)),
    FCP: Math.round(med(rs.map((r) => r.FCP))),
    LCP: Math.round(med(rs.map((r) => r.LCP))),
    TBT: Math.round(med(rs.map((r) => r.TBT))),
    SI: Math.round(med(rs.map((r) => r.SI))),
    lcp: rs[0].lcpElement,
  });
}
console.log(JSON.stringify(results, null, 2));
