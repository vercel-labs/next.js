const https = require('https'), fs = require('fs');
const srv = https.createServer({key: fs.readFileSync(__dirname+'/key.pem'), cert: fs.readFileSync(__dirname+'/cert.pem')}, (req,res)=>{
  console.log(new Date().toISOString(), 'upstream got', req.method, req.url, 'host=', req.headers.host);
  res.setHeader('content-type','application/json');
  res.end(JSON.stringify({ok:true, url:req.url}));
});
srv.keepAliveTimeout = 500; // aggressively close idle keep-alive sockets (like many prod servers/ALBs)
srv.headersTimeout = 1000;
srv.listen(8443, ()=>console.log('upstream https on 8443, keepAliveTimeout=500ms'));
