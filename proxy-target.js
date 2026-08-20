const http = require('http');
http.createServer((req,res)=>{
  const code = parseInt((req.url||'').replace(/^\//,'').split('?')[0],10);
  const status = Number.isFinite(code) && code>=200 && code<600 ? code : 200;
  res.writeHead(status, {'content-type':'text/plain'});
  res.end(`PROXIED HOST RESPONSE ${status} for ${req.url}`);
}).listen(3001, ()=>console.log('proxy target on 3001'));
