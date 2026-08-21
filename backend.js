const http = require('http');
http.createServer((req,res)=>{res.setHeader('content-type','application/json');res.end(JSON.stringify({message:'hello from backend', ts: Date.now()}))}).listen(8000,'0.0.0.0',()=>console.log('backend on 8000'));
