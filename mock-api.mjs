import http from 'node:http';
const port = 9999;
http.createServer((req,res)=>{
  let body='';req.on('data',c=>body+=c);
  req.on('end',()=>{
    console.log(req.method, req.url, body.slice(0,200));
    if(req.method==='POST'){res.writeHead(200,{'content-type':'application/json'});res.end(JSON.stringify({url:`http://127.0.0.1:${port}/upload-stats`}));}
    else {res.writeHead(200);res.end('ok');}
  });
}).listen(port,()=>console.log('mock api on '+port));
