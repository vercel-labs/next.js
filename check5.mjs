import { chromium } from "playwright";
const [,, url, durS, shot, kbps, cpu] = process.argv;
const dur = Number(durS);
const b = await chromium.launch();
const p = await b.newPage();
const cdp = await p.context().newCDPSession(p);
if (kbps) await cdp.send("Network.emulateNetworkConditions", { offline:false, latency:100, downloadThroughput: Number(kbps)*1024/8, uploadThroughput: 200*1024/8 });
if (cpu) await cdp.send("Emulation.setCPUThrottlingRate", { rate: Number(cpu) });
p.on("console", m => { const t=m.text(); if(!t.includes("DevTools")) console.log("[console]", m.type(), t.slice(0,160)); });
p.on("pageerror", e => console.log("[pageerror]", e.message));
const t0 = Date.now();
p.goto(url, {waitUntil:'domcontentloaded'}).then(()=>console.log((Date.now()-t0)+"ms dcl")).catch(e=>console.log("goto err", e.message));
let last="";
while (Date.now()-t0 < dur) {
  const s = await p.evaluate(() => ({ f: !!document.getElementById("fallback"), r: document.querySelectorAll("#resolved").length, hyd: !!window.__hydrated })).catch(()=>null);
  const j = JSON.stringify(s);
  if (j!==last) { console.log((Date.now()-t0)+"ms", j); last=j; }
  await p.waitForTimeout(200);
}
console.log("final", last);
await p.screenshot({ path: shot });
await b.close();
