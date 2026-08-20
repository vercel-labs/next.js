const http=require('http');
const url=process.argv[2];
const t0=Date.now();
http.get(url,{headers:{'accept':'text/html'}},res=>{
  console.log('status',res.statusCode,'ttfb-headers',Date.now()-t0,'ms');
  let n=0;
  res.on('data',c=>{n++;const s=c.toString();
    const marks=['LOADING_TSX_FALLBACK','SUSPENSE_FALLBACK','DASHBOARD_SHELL','SLOW_DATA'].filter(m=>s.includes(m));
    console.log(`chunk#${n} t=${Date.now()-t0}ms len=${c.length} ${marks.join(',')}`);});
  res.on('end',()=>console.log('end t=',Date.now()-t0));
});
