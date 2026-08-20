const http2 = require('http2'), fs = require('fs');
const srv = http2.createSecureServer({
  key: fs.readFileSync(__dirname+'/key.pem'),
  cert: fs.readFileSync(__dirname+'/cert.pem'),
  ALPNProtocols: ['h2'], // HTTP/2 only, like many managed hosting/dev domains
});
srv.on('stream', (stream, headers) => {
  console.log('h2 upstream got', headers[':method'], headers[':path']);
  stream.respond({'content-type':'application/json',':status':200});
  stream.end(JSON.stringify({ok:true, via:'http2', path: headers[':path']}));
});
srv.on('session', () => console.log('h2 session established'));
srv.listen(8444, ()=>console.log('h2-only upstream on 8444'));
