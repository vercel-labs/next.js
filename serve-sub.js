// serves ./out under http://localhost:3001/sub/ to emulate deploying the export in a subdirectory
const http=require('http'),fs=require('fs'),p=require('path');
const types={'.html':'text/html','.js':'text/javascript','.css':'text/css','.woff2':'font/woff2','.txt':'text/plain','.ico':'image/x-icon'};
http.createServer((req,res)=>{
  let u=decodeURIComponent(req.url.split('?')[0]);
  let rel=u.startsWith('/sub/')?u.slice(5):null;
  if(rel===null){res.writeHead(404);return res.end('outside /sub/: '+u);}
  if(rel===''||rel.endsWith('/'))rel+='index.html';
  let f=p.join(__dirname,'out',rel);
  if(!fs.existsSync(f)&&fs.existsSync(f+'.html'))f=f+'.html';
  if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){res.writeHead(404);return res.end('404 '+u);}
  res.writeHead(200,{'content-type':types[p.extname(f)]||'application/octet-stream'});
  fs.createReadStream(f).pipe(res);
}).listen(3001,()=>console.log('serving out/ at http://localhost:3001/sub/'));
