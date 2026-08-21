import { spawn } from 'node:child_process';
import path from 'node:path';
const root = process.cwd();
const files = process.argv.slice(2);
const p = spawn('node', [path.join(root,'node_modules/typescript/lib/tsserver.js'),'--allowLocalPluginLoads','--pluginProbeLocations', path.join(root,'node_modules')], {cwd: root});
let seq=1; let buf='';
const send=(o)=>{p.stdin.write(JSON.stringify({seq:seq++,type:'request',...o})+'\n');};
p.stdout.on('data', d=>{
  buf+=d.toString();
  let idx;
  while((idx=buf.indexOf('\r\n\r\n'))>=0){
    const header=buf.slice(0,idx);
    const len=+/Content-Length: (\d+)/.exec(header)[1];
    const body=buf.slice(idx+4, idx+4+len);
    if(buf.length < idx+4+len) break;
    buf=buf.slice(idx+4+len);
    const msg=JSON.parse(body);
    if(msg.command==='semanticDiagnosticsSync'){
      console.log('=== '+msg.request_seq, JSON.stringify(msg.body,null,1));
    }
    if(msg.event==='projectLoadingFinish'||(msg.event==='telemetry')) console.log('EVENT',msg.event, JSON.stringify(msg.body));
  }
});
p.stderr.on('data',d=>process.stderr.write(d));
for(const f of files) send({command:'open', arguments:{file: path.join(root,f)}});
setTimeout(()=>{
  for(const f of files) send({command:'semanticDiagnosticsSync', arguments:{file: path.join(root,f)}});
  setTimeout(()=>p.kill(),6000);
},4000);
