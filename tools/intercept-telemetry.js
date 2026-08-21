const fs=require('fs');
const LOG='./telemetry-intercept.log';
const orig=globalThis.fetch;
globalThis.fetch=async function(url,opts){
  const u=String(url&&url.url?url.url:url);
  if(u.includes('telemetry.nextjs.org')){
    fs.appendFileSync(LOG,`\n=== ${new Date().toISOString()} pid=${process.pid} argv=${process.argv.slice(1).join(' ')}\nPOST ${u}\nbody: ${opts&&opts.body}\n`);
    const res=await orig.apply(this,arguments);
    fs.appendFileSync(LOG,`response: ${res.status} ${res.statusText}\n`);
    return res;
  }
  return orig.apply(this,arguments);
};
