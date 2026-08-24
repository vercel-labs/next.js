import {xxh3} from '@node-rs/xxhash';
const CH="0123456789abcdefghijklmnopqrstuvwxyz_-";
const b38=n=>{let s="";for(let i=0;i<13;i++){s=CH[Number(n%38n)]+s;n/=38n;}return s;};
const u8=v=>Buffer.from([v]);
const str=s=>{const b=Buffer.alloc(8+Buffer.byteLength(s));b.writeBigUInt64LE(BigInt(Buffer.byteLength(s)),0);b.write(s,8);return b;};
const chunkHash=q=>{
  const s=`[project]/src/gen/m.js?${q} [app-route] (ecmascript)`;
  return b38(xxh3.xxh64(Buffer.concat([u8(2),str("chunk item"),str(s),u8(3),str("ecmascript build node chunk")]))).slice(0,7);
};
// verify
const known={q0:"09y51mi",q1:"19iv757",q2:"0c37l7q",q3:"1wr3hgt",q4:"0acyriw",q5:"132gaut",q6:"1whhsim",q7:"0lb4lfa"};
for(const [k,v] of Object.entries(known)) if(chunkHash(k)!==v) throw new Error("mismatch "+k+" "+chunkHash(k));
console.log("model verified against 8 emitted chunk names");
const map=new Map(); const hits=[];
for(let i=0;i<4000000;i++){
  const q="q"+i, hh=chunkHash(q);
  const prev=map.get(hh);
  if(prev!==undefined){hits.push([prev,q,hh]); if(hits.length>=5) break;} else map.set(hh,q);
}
console.log(hits);
