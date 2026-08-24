const http = require('http');
const orig = AbortSignal.any.bind(AbortSignal);
const tracked = [];
let created = 0;
AbortSignal.any = function (signals) {
  const sig = orig(signals);
  created++;
  tracked.push(new WeakRef(sig));
  return sig;
};
const resRefs = [];
let resCount = 0;
const origEmit = http.Server.prototype.emit;
http.Server.prototype.emit = function (event, req, res) {
  if (event === 'request') { resCount++; resRefs.push(new WeakRef(res)); }
  return origEmit.apply(this, arguments);
};
process.on('SIGUSR2', () => {
  if (global.gc) { global.gc(); global.gc(); global.gc(); }
  const aliveSig = tracked.filter((r) => r.deref()).length;
  const aliveRes = resRefs.filter((r) => r.deref()).length;
  const m = process.memoryUsage();
  console.error(`[REPORT pid=${process.pid}] requests=${resCount} liveResponses=${aliveRes} compositesCreated=${created} compositesAlive=${aliveSig} heapUsed=${(m.heapUsed/1048576).toFixed(1)}MB rss=${(m.rss/1048576).toFixed(1)}MB`);
});
